#!/usr/bin/env node
// Practice launch: sends each base email to Resend TEST addresses via the local practice server.
// Usage: node scripts/send-launch.mjs [--dry-run]
// Never touches api.resend.com. Recipients are checked with the same rules as the send-guard hook.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "./review.mjs";
import { decide } from "../.claude/hooks/send-guard.mjs";

const BASE = process.env.RESEND_BASE_URL || "http://localhost:4000";
if (/api\.resend\.com/.test(BASE)) { console.error("Refusing: real Resend API"); process.exit(2); }
const DRY = process.argv.includes("--dry-run");
const DIR = "campaigns/lantern-box-launch/emails";
const TO = ["delivered@resend.dev"];
if (process.env.MY_EMAIL) TO.push(process.env.MY_EMAIL);

for (const name of readdirSync(DIR).filter((n) => n.endsWith(".md")).sort()) {
  const { fm, body } = parse(readFileSync(`${DIR}/${name}`, "utf8"));
  const html = body.replaceAll("{{first_name}}", "Reader").replaceAll("{{unsubscribe_url}}", "https://example.com/unsubscribe");
  const payload = { from: "Lantern Lane <onboarding@resend.dev>", to: TO, subject: fm.subject, text: html };
  const blocked = decide({ tool_name: "send_email", tool_input: payload });
  if (blocked) { console.error(`${name}: BLOCKED - ${blocked}`); process.exit(2); }
  if (DRY) { console.log(`[dry-run] ${name} -> ${TO.join(", ")} | ${fm.subject}`); continue; }
  const res = await fetch(`${BASE}/emails`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.RESEND_API_KEY || "re_practice_local_only"}` },
    body: JSON.stringify(payload),
  });
  console.log(`${name}: ${res.status} ${await res.text()}`);
}
