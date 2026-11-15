# studio-kit

A reusable plugin for email marketing studios, built by Maqsood Ahmad Farooqi during the Lantern Lane Books lab.

| Part | What it does |
|---|---|
| `hooks/send-guard.mjs` | Blocks sends to anyone but `*@resend.dev` / `MY_EMAIL`, all broadcasts, and the real Resend API |
| `agents/email-reviewer.md` | Read-only reviewer subagent for brand and email rules |
| `skills/personalize/` | Segment-based personalization workflow |
| `scripts/review.mjs` | Rule-based review with schema-shaped JSON output |

## Install (owner runs)
```
/plugin marketplace add ai-universe-mi/lantern-email-studio
/plugin install studio-kit@lantern-studio
```
