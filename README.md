# 🏮 Lantern Lane Books - Email Studio

**By Maqsood Ahmad Farooqi** · Panaversity Email Marketing Studio assignment

A practice email marketing studio built with Claude Code for **Lantern Lane Books**, a fictional
independent bookshop launching **The Lantern Box**, a monthly book subscription.

> Everything here is practice. All readers are fictional (`@example.com`) and sending only works
> against a local practice server and Resend test addresses.

## What's inside

| Area | Path |
|---|---|
| Project memory and rules | `CLAUDE.md`, `.claude/rules/emails.md` |
| Brand voice | `brand/voice.md` |
| Fictional readers (24, 3 segments) | `leads/leads.csv`, `leads/CLAUDE.md` |
| Campaign plan and sequence | `campaigns/lantern-box-launch/plan.md`, `sequence.md` |
| 4 launch emails | `campaigns/lantern-box-launch/emails/` |
| 12 personalized emails | `campaigns/lantern-box-launch/personalized/<segment>/` |
| Personalize skill | `.claude/skills/personalize/SKILL.md` |
| Send-guard hook | `.claude/hooks/send-guard.mjs` (wired in `.claude/settings.json`) |
| Practice MCP server | `.mcp.json` (Resend MCP → `localhost:4000`) |
| Review script + schema | `scripts/review.mjs`, `review/schema.json` |
| Reusable plugin | `studio-kit/`, `.claude-plugin/marketplace.json` |
| CI | `.github/workflows/email-review.yml` |
| Notes and handoff | `notes/` |

## Safety model
1. **Hook:** every send/email/broadcast tool call passes through `send-guard.mjs`. Only
   `*@resend.dev` and the owner's `MY_EMAIL` are allowed; broadcasts and `api.resend.com` are blocked.
2. **Practice server:** the MCP server and launch script point at `http://localhost:4000`.
3. **Fake data:** every reader is `@example.com`; `leads/CLAUDE.md` forbids real people.
4. **No secrets in git:** personal settings live in `.claude/settings.local.json` (gitignored).

## Try it
```bash
node scripts/test-all.mjs                          # run every check
node scripts/review.mjs campaigns/lantern-box-launch/emails/01-a-lamp-in-the-window.md
node scripts/review.mjs review/samples/bad-email.md   # fails on purpose
node scripts/send-launch.mjs --dry-run
```

## Author
**Maqsood Ahmad Farooqi** - GitHub [@ai-universe-mi](https://github.com/ai-universe-mi)
