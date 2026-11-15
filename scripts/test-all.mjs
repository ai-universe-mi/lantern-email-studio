#!/usr/bin/env node
// Runs every automated check in the studio. Usage: node scripts/test-all.mjs
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { review } from "./review.mjs";
import { decide } from "../.claude/hooks/send-guard.mjs";

let pass = 0, fail = 0;
const check = (name, ok) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };
const walk = (d) => readdirSync(d).flatMap((n) => statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]);

// 1. Required files
for (const f of ["CLAUDE.md", "brand/voice.md", "leads/leads.csv", "leads/CLAUDE.md",
  "campaigns/lantern-box-launch/plan.md", "campaigns/lantern-box-launch/sequence.md",
  ".claude/settings.json", ".claude/hooks/send-guard.mjs", ".claude/skills/personalize/SKILL.md",
  ".claude/rules/emails.md", "review/schema.json", "studio-kit/.claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json"])
  check(`exists: ${f}`, existsSync(f));

// 2. Leads are fictional
const leads = readFileSync("leads/leads.csv", "utf8").trim().split("\n").slice(1);
check(`leads: 24 records (${leads.length})`, leads.length === 24);
check("leads: all @example.com", leads.every((l) => l.split(",")[3].endsWith("@example.com")));
check("leads: 3 segments", new Set(leads.map((l) => l.split(",")[4])).size === 3);

// 3. Every email passes review
const emails = walk("campaigns/lantern-box-launch").filter((f) => /\/(emails|personalized)\//.test(f));
check(`emails: 16 files (${emails.length})`, emails.length === 16);
for (const f of emails) check(`review pass: ${f}`, review(readFileSync(f, "utf8"), f).overall === "pass");

// 4. Bad sample is caught
check("review catches bad sample", review(readFileSync("review/samples/bad-email.md", "utf8")).overall === "fail");

// 5. Send-guard behaviour
const me = "owner@mydomain.test";
check("guard allows @resend.dev", decide({ tool_name: "mcp__resend__send-email", tool_input: { to: "delivered@resend.dev" } }, me) === null);
check("guard allows MY_EMAIL", decide({ tool_name: "mcp__resend__send-email", tool_input: { to: [me] } }, me) === null);
check("guard blocks a lead", decide({ tool_name: "mcp__resend__send-email", tool_input: { to: "amira.hollis@example.com" } }, me) !== null);
check("guard blocks mixed list", decide({ tool_name: "mcp__resend__send-email", tool_input: { to: ["delivered@resend.dev"], bcc: "x@gmail.com" } }, me) !== null);
check("guard blocks broadcast", decide({ tool_name: "mcp__resend__send-broadcast", tool_input: {} }, me) !== null);
check("guard blocks real API in Bash", decide({ tool_name: "Bash", tool_input: { command: "curl https://api.resend.com/emails" } }, me) !== null);
check("guard ignores unrelated tools", decide({ tool_name: "Read", tool_input: { file_path: "x" } }, me) === null);

// 6. Plugin copy in sync
check("studio-kit guard matches project guard",
  readFileSync("studio-kit/hooks/send-guard.mjs", "utf8") === readFileSync(".claude/hooks/send-guard.mjs", "utf8"));

// 7. No secrets tracked
check("no real Resend key in repo", !walk(".").filter((f) => !f.includes(".git/") && !f.includes("node_modules"))
  .some((f) => /re_[A-Za-z0-9]{20,}/.test(readFileSync(f, "utf8"))));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
