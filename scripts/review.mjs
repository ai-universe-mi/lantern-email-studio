#!/usr/bin/env node
// Rule-based email review for Lantern Lane Books.
// Usage: node scripts/review.mjs <email.md> [--baseline review/baseline.json]
// Prints JSON matching review/schema.json. Exit 1 if any un-accepted HIGH finding.
import { readFileSync, existsSync } from "node:fs";

const BANNED = ["act now", "hurry", "last chance", "limited time only", "life-changing",
  "cures", "cure ", "therapy", "guaranteed"];

export function parse(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const fm = {};
  if (!m) return { fm, body: text };
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return { fm, body: m[2] };
}

export function review(text, file = "") {
  const f = [];
  const add = (id, severity, rule, location, detail) => f.push({ id, severity, rule, location, detail });
  const { fm, body } = parse(text);

  for (const k of ["subject", "preview", "cta", "cta_url"])
    if (!fm[k]) add(`missing-${k}`, "high", "front matter complete", "front matter", `no ${k}`);

  const s = fm.subject || "";
  if (s.length > 60) add("subject-too-long", "medium", "subject <= 60 chars", "subject", `${s.length} chars`);
  if (/\b[A-Z]{3,}\b/.test(s.replace(/\bPKR\b/g, ""))) add("subject-all-caps", "high", "no ALL CAPS", "subject", s);
  if (/^(re|fwd?):/i.test(s)) add("subject-fake-reply", "high", "no fake Re:/Fwd:", "subject", s);
  if (/\p{Extended_Pictographic}/u.test(s)) add("subject-emoji", "medium", "no emoji in subject", "subject", s);

  const p = fm.preview || "";
  if (p.length > 90) add("preview-too-long", "low", "preview <= 90 chars", "preview", `${p.length} chars`);
  if (p && p === s) add("preview-repeats-subject", "medium", "preview adds something new", "preview", p);

  const all = (s + " " + p + " " + body).toLowerCase();
  for (const w of BANNED)
    if (all.includes(w)) add(`banned-${w.trim().replace(/\s+/g, "-")}`, "high", "banned phrase", "copy", w.trim());

  const links = (body.match(/\[[^\]]+\]\((?!\{\{)[^)]+\)/g) || []);
  if (links.length !== 1) add("cta-count", "high", "exactly one CTA link", "body", `${links.length} CTA links`);
  if (!body.includes("{{unsubscribe_url}}")) add("missing-unsubscribe", "high", "unsubscribe line", "footer", "none");
  if (!body.includes("{{first_name}}")) add("missing-greeting", "low", "personal greeting", "opening", "no {{first_name}}");

  const words = body.split("---")[0].replace(/[#*\[\]()>]/g, " ").split(/\s+/).filter(Boolean).length;
  if (words < 60 || words > 200) add("body-length", "low", "body 80-180 words", "body", `${words} words`);

  return { file, overall: f.some((x) => x.severity === "high") ? "fail" : "pass", findings: f };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const file = process.argv[2];
  if (!file) { console.error("usage: node scripts/review.mjs <email.md> [--baseline file]"); process.exit(2); }
  const bi = process.argv.indexOf("--baseline");
  const accepted = bi > 0 && existsSync(process.argv[bi + 1])
    ? JSON.parse(readFileSync(process.argv[bi + 1], "utf8")).accepted || [] : [];
  const result = review(readFileSync(file, "utf8"), file);
  result.findings = result.findings.filter((x) => !accepted.includes(x.id));
  result.overall = result.findings.some((x) => x.severity === "high") ? "fail" : "pass";
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.overall === "fail" ? 1 : 0);
}
