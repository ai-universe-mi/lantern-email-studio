# Campaign plan - The Lantern Box launch

## Goal
Launch **The Lantern Box**: one hand-picked book a month, a bookmark, a short letter from the
bookseller about why we chose it, and a small treat (loose-leaf tea or a postcard print).
Target: 120 founding subscribers in the first four weeks (practice target).

## Offer
- Monthly box: PKR 3,500 (fictional price)
- Founding members (first four weeks): PKR 2,900 a month, kept for as long as they stay
- Gift option: 3-month or 6-month gift, sent with a handwritten card
- Skip or cancel any month, no questions asked

## Audience (see `leads/CLAUDE.md`)
| Segment | Size | What they need to hear |
|---|---|---|
| browsers | 8 | What it is, why it's low-risk, what the first box looks like |
| bookworms | 8 | How we choose, early access, nothing they've already read |
| gift-givers | 8 | Gifting is easy, beautifully wrapped, arrives on time |

## Channels
Email only for this practice launch. Four emails over 12 days.

## Sequence (details in `sequence.md`)
1. Day 0 - *A lamp in the window*: announce the box.
2. Day 3 - *Inside the first box*: show what arrives.
3. Day 7 - *How Nadia chooses*: the story behind the picks.
4. Day 12 - *Founding price closes Sunday*: honest reminder, no pressure.

## Success measures (practice)
- Open rate above 40%, click rate above 5%
- Unsubscribe rate below 0.5%
- Zero sends to non-test addresses (guaranteed by the send-guard hook)

## Risks and guardrails
- Over-selling: each email has one CTA and no fake urgency (the real close date is stated once).
- Wrong recipients: send-guard hook + practice server only.
- Tone drift: every email reviewed with `scripts/review.mjs` and the email-reviewer agent.
