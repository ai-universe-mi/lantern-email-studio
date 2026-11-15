---
paths:
  - "campaigns/**/*.md"
---
# Email rules (loaded when editing campaign files)

1. Front matter must have `subject`, `preview`, `cta`, `cta_url`.
2. Subject: max 60 characters, sentence case, no ALL CAPS words, no "Re:" / "Fwd:", no emoji.
3. Preview: max 90 characters and must not repeat the subject.
4. Body: 80-180 words, greeting with `{{first_name}}`, exactly one CTA link.
5. Every email ends with an unsubscribe line containing `{{unsubscribe_url}}`.
6. Banned phrases: "act now", "hurry", "last chance", "limited time only", "life-changing",
   "cures", "therapy", "guaranteed".
7. Sign off as "Nadia & the Lantern Lane team".
