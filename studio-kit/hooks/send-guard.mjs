#!/usr/bin/env node
// Lantern Lane send-guard: a PreToolUse hook.
// Blocks (exit 2) any email send to a recipient that is not *@resend.dev or $MY_EMAIL,
// any broadcast/bulk tool, and any Bash command that talks to the real Resend API.
// Everything else passes (exit 0).

const SAFE_DOMAIN = "@resend.dev";
const BROADCAST = /broadcast|bulk|audience|batch[_-]?send|send[_-]?batch/i;
const SEND_TOOL = /send|email|mail/i;
const RECIPIENT_KEYS = ["to", "cc", "bcc", "reply_to", "replyTo", "recipient", "recipients"];

async function readStdin() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

function stop(reason) {
  process.stderr.write(`[send-guard] BLOCKED: ${reason}\n`);
  process.exit(2);
}

function collectRecipients(value, found = []) {
  if (value == null) return found;
  if (typeof value === "string") {
    for (const part of value.split(/[,;]/)) {
      const m = part.match(/[^\s<>"']+@[^\s<>"']+/);
      if (m) found.push(m[0].toLowerCase());
    }
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectRecipients(v, found));
  } else if (typeof value === "object") {
    if (value.email) collectRecipients(value.email, found);
  }
  return found;
}

function findRecipients(input, found = []) {
  if (!input || typeof input !== "object") return found;
  for (const [key, val] of Object.entries(input)) {
    if (RECIPIENT_KEYS.includes(key)) collectRecipients(val, found);
    else if (val && typeof val === "object") findRecipients(val, found);
  }
  return found;
}

export function decide(event, myEmail = process.env.MY_EMAIL || "") {
  const tool = String(event.tool_name || "");
  const input = event.tool_input || {};
  const mine = myEmail.trim().toLowerCase();

  if (tool === "Bash") {
    const cmd = String(input.command || "");
    if (/api\.resend\.com/i.test(cmd)) return "real Resend API is off-limits; use http://localhost:4000";
    return null;
  }
  if (BROADCAST.test(tool)) return `broadcast/bulk tool "${tool}" is never allowed`;
  if (!SEND_TOOL.test(tool)) return null;

  const recipients = findRecipients(input);
  if (recipients.length === 0 && /send/i.test(tool)) return "send call with no readable recipient";
  const bad = recipients.filter((r) => !(r.endsWith(SAFE_DOMAIN) || (mine && r === mine)));
  if (bad.length) return `recipient(s) not allowed: ${bad.join(", ")} (only *${SAFE_DOMAIN} or MY_EMAIL)`;
  return null;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const raw = await readStdin();
  let event;
  try { event = JSON.parse(raw || "{}"); }
  catch { if (/send|mail|broadcast/i.test(raw)) stop("unreadable send event"); process.exit(0); }
  const reason = decide(event);
  if (reason) stop(reason);
  process.exit(0);
}
