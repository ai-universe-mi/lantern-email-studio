# Skills and plugins I chose

| Choice | Source | Why |
|---|---|---|
| `marketing` plugin | anthropics/knowledge-work-plugins (official) | Campaign plan, email sequence and brand review commands from a trusted publisher |
| Own `personalize` skill | written in this repo | Segment-only personalization with our own rules; no reading individual readers |
| Own `email-reviewer` agent | written in this repo | Read-only, cannot send, gives schema-shaped output |
| `resend-mcp` (practice) | npm, pointed at `localhost:4000` | Lets Claude send to test addresses only; the hook adds a second lock |

## What I avoided
- Community skills that ask for broad Bash or network access with no clear reason.
- Any tool that can send to an audience or list in one call.
