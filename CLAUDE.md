# Lantern Lane Books - Email Studio

Owner: **Maqsood Ahmad Farooqi**

Email marketing studio for **Lantern Lane Books**, a made-up independent bookshop.
Current launch: **The Lantern Box**, a monthly book subscription.

Everything here is practice. There are no real customers and no real email addresses.

## Folder map
- `brand/` - brand voice (the source of truth for tone)
- `leads/` - fictional reader list (has its own `leads/CLAUDE.md`)
- `campaigns/lantern-box-launch/` - plan, sequence, base emails, personalized versions
- `review/` - review schema, baseline and a deliberately bad sample
- `scripts/` - review, test and practice-send scripts
- `studio-kit/` - reusable plugin for any client studio
- `notes/` - research, decisions, handoff
- `.claude/` - rules, skills and hooks for this studio

## Golden rules
1. **Practice server only.** Sending goes to `http://localhost:4000`. Never call `api.resend.com`
   or any real email provider.
2. **Allowed recipients:** `*@resend.dev` test addresses and the owner's `MY_EMAIL`. The send-guard
   hook blocks everyone else. Do not try to work around it.
3. **No broadcasts.** Never use bulk, audience or broadcast send tools.
4. **No secrets in git.** Keys live in env vars or `.claude/settings.local.json` (gitignored).
5. **Fictional data only.** Every reader email ends in `@example.com`.
6. **One step at a time.** Finish a step, say what changed and how to check it, then stop.
7. **Small commits** with conventional messages (`feat:`, `docs:`, `fix:`, `chore:`).

## Brand voice
@brand/voice.md

## Writing emails
- Follow `.claude/rules/emails.md` for every email.
- Every email has front matter (`subject`, `preview`, `cta`, `cta_url`), a body, one CTA and an
  unsubscribe line.
- Base emails: `campaigns/lantern-box-launch/emails/NN-short-name.md`.
- Personalized: `campaigns/lantern-box-launch/personalized/<segment>/NN-short-name.md`.

## Checking work
- `node scripts/review.mjs <file>` - rule-based review, JSON output matching `review/schema.json`.
- `node scripts/test-all.mjs` - runs every automated check in the project.

## When the owner is needed
Some actions only the owner can do (`/plugin`, `/mcp`, `/compact`, a new session, CLI flags).
Give the exact command and wait.
