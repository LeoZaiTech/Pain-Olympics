# AGENTS.md

## Read first

1. `README.md`
2. `progress.md`
3. `ARCHITECTURE.md`
4. `Docs/REACT_MIGRATION_PLAN.md`
5. `Docs/AI_AGENT_SETUP.md`

## Operating rules

- Stay in one mode: `explore`, `decide`, `build`, `polish`, or `review`
- Treat repo files as source of truth over chat history
- Keep changes scoped to the current task
- Update `progress.md` after completing meaningful work
- Prefer small, complete improvements over broad rewrites

## Project context

- **Current state**: Vanilla HTML/CSS/JS prototype
- **Target state**: React + Vite (web), React Native (mobile)
- **Primary flow**: Solo deck-building card game with NPC opponents
- **Tone**: Gallows humor, not cruelty

## Key constraints

- Follow component mapping in `Docs/REACT_MIGRATION_PLAN.md`
- Use existing CSS variables from `styles.css`
- Keep business logic in `hooks/`, rendering in `components/`
- Match existing visual style before innovating
- NPC content must use gallows humor tone

## File ownership

| Area | Safe to edit | Caution |
|------|--------------|---------|
| `data.js` | Card/NPC content | Don't break exports |
| `data/*.json` | NPC decks/dialogue | Validate JSON |
| `app.js` | Game logic | Test after changes |
| `styles.css` | Visual styling | Keep CSS variables |
| `src/` | React components | Follow patterns |

## Verification

After any change:

```bash
node --check app.js
node --check server.js
npm start
# verify at http://127.0.0.1:3000
```

## Communication format

When receiving work:

```text
Mode:
Goal:
Source of truth:
Constraints:
Deliverable:
Verification:
Definition of done:
```

## Finish condition

Before completing a task:

1. What changed
2. What was verified
3. What needs follow-up
4. Update `progress.md` if meaningful work completed
