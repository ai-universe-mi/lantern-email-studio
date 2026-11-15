---
name: personalize
description: Create segment-specific versions of a campaign email for any client studio, using the segments in leads/CLAUDE.md. Use when asked to personalize, segment or tailor an email.
---
# Personalize an email

## Input
A base email at `campaigns/<campaign>/emails/NN-name.md` (or any campaign email path).

## Steps
1. Read the base email and `brand/voice.md`.
2. Read `leads/CLAUDE.md` for what each segment needs. Do **not** read individual lead rows;
   personalization is by segment, never by a real person.
3. For each segment write `campaigns/<campaign>/personalized/<segment>/NN-name.md`:
   - Keep the subject, preview and front matter keys.
   - Add **one** segment paragraph after the opening.
   - Change the CTA wording to fit the segment (same `cta_url`).
   - Keep `{{first_name}}` and the unsubscribe line.
4. Run `node scripts/review.mjs <file>` on every new file. Fix anything rated high.
5. Report the files created and the review result. Do not send anything.

## Never
- Invent facts about a reader.
- Add urgency the base email doesn't have.
- Change prices or dates.
