# Handoff - Lantern Lane Books email studio

**Owner:** Maqsood Ahmad Farooqi

## Done
- Brand voice, campaign plan and 4-email sequence for The Lantern Box
- 24 fictional readers in 3 segments
- 12 personalized emails (browsers, bookworms, gift-givers)
- Send-guard hook (project + plugin copy), practice MCP server config
- Rule-based review script + schema, deliberately bad sample
- `studio-kit` plugin and marketplace entry
- GitHub Actions workflow running `node scripts/test-all.mjs`

## How to check
```
node scripts/test-all.mjs          # all automated checks
node scripts/review.mjs review/samples/bad-email.md   # should FAIL
node scripts/send-launch.mjs --dry-run                # shows test-only recipients
```

## Owner-only steps
- Add `MY_EMAIL` in `.claude/settings.local.json` (gitignored) under `env`.
- Start the Resend practice server on port 4000 before a real practice send.
