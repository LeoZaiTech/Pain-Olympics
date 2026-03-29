# Pain Olympics – AI Workflow Sequence

**Document Type:** Task Sequencing & Handoff Protocol  
**Created:** 2026-03-26  
**Agents:** Windsurf/Cascade, Codex

---

## Recommended Execution Order

**Current recommendation: content/data agents go first, then visual-polish agents iterate on top.**

---

## Rationale

| Factor | Why Codex First |
|--------|-----------------|
| **Content before polish** | Windsurf can't style cards that don't exist. Codex generates content, Windsurf polishes it. |
| **Data extraction enables refactors** | Pulling `CARD_POOL`, `TAGS`, `SETTINGS` into `data.js` gives Windsurf a cleaner foundation for React migration. |
| **Windsurf work is iterative** | CSS/animation polish requires browser preview and value tweaking—end-of-pipeline work. |
| **Test scaffolding on stable logic** | Game logic in `app.js` is stable now. Tests written now won't immediately break from refactors. |

---

## Full Sequence

| Step | Agent | Task | Output |
|------|-------|------|--------|
| 1 | **Codex** | Extract core game data into a module/folder | Data files for `TAGS`, `CARD_POOL`, `SETTINGS` |
| 2 | **Codex / ChatGPT** | Expand content in controlled batches | New cards or the next NPC pack |
| 3 | **Windsurf** | Integrate/refine visuals against the current data layer | Updated `app.js`, `styles.css`, `index.html` |
| 4 | **Codex** | Generate test scaffolding around stable logic | `app.test.js` or similar |
| 5 | **Windsurf** | Atmosphere, animation, and responsive polish | Casino/game-show pass, card reveal, mobile cleanup |
| 6 | **Both** | Review & iterate | Content/visual balancing |

---

## Handoff Protocol

### Codex → Windsurf Handoff
After Codex completes steps 1–3:
1. Codex creates/updates files and documents changes
2. Codex leaves a note in this folder confirming completion
3. Windsurf picks up, integrates, and continues

### Windsurf → Codex Handoff
After Windsurf completes integration + styling:
1. Windsurf confirms visual state is stable
2. Windsurf requests test suite generation
3. Codex generates tests against current logic

---

## Current State Snapshot

**As of 2026-03-27:**
- `app.js`: ~50 cards in `CARD_POOL`, 8 tags, runtime NPC content loading for solo mode
- `styles.css`: 1000+ lines, working but needs atmosphere push
- `index.html`: Layout stable, match board functional
- `data/npc-decks.json`: exists and currently powers `Walmart Karen`
- `data/npc-dialogue.json`: exists and currently powers `Walmart Karen`
- `Docs/NPC Profiles/Walmart Karen.md`: first NPC design spec exists
- `README.md` + AI handoff docs: refreshed to reflect the live Karen integration
- **No separate main data module yet**
- **No test suite yet**

---

## Files Codex Will Create/Modify

| File | Action | Contents |
|------|--------|----------|
| `data.js` or `data/` module set | Create | Extracted `TAGS`, `CARD_POOL`, `SETTINGS` |
| `app.js` | Modify | Import from extracted data, reduce inline data size |
| `npc-dialogue.json` | Expand | Taunt/win/loss lines for each NPC |
| `app.test.js` | Create | Test scaffolding for game logic |

---

## Files Windsurf Will Modify

| File | Action | Focus |
|------|--------|-------|
| `styles.css` | Modify | Match board atmosphere, card styling, animations |
| `app.js` | Modify | Integration of new data, animation triggers |
| `index.html` | Modify | Any structural changes for animations |

---

## Success Criteria

**After current content/data pass:**
- [ ] Main game data extracted from `app.js`
- [x] `Walmart Karen` NPC JSON + profile exist and are live in solo mode
- [ ] Second NPC pack exists in the same structure
- [ ] No runtime errors in `app.js`

**After Windsurf pass:**
- [ ] Match board feels "smoky casino + game show"
- [ ] Cards feel tactile and premium
- [ ] Portrait has spotlight/glow effect
- [ ] Card reveal has flip animation
- [ ] Mobile layout doesn't break

**After test pass:**
- [ ] `npm test` runs without errors
- [ ] Core game logic functions covered

---

## Notes for Codex

When you pick this up:

1. **Do not redo Walmart Karen** — She is already integrated and should be treated as the template.
2. **Start with data extraction** — This still unblocks the next clean round of work.
3. **Reference `Starting Deck.md`** — Many card ideas already exist there.
4. **Follow existing card structure exactly** — `{ id, title, points, tags }`.
5. **Point distribution:** Mostly 5–7, fewer 4s and 8–9s.
6. **Tone:** Gallows humor, not cruelty. See `Brainstorming and Conceptualizing.md` Q3.

Questions I had for you are in `windsurf-to-codex.md`.

---

## Notes for Future Windsurf Sessions

When you pick this up after Codex:

1. **Do not assume Karen is still placeholder-only** — She now has a live JSON-backed pack and match-log dialogue.
2. **If data extraction lands, verify imports first** — That refactor will be the next likely break point.
3. **Preview in browser before styling** — Confirm baseline works.
4. **Commit stable checkpoints** — Don't lose working states.

---

## Immediate Next Recommendations

1. Extract the main inline game data from `app.js`.
2. Create the second NPC pack using the Karen folder/JSON pattern.
3. Add a small test harness before major refactors or React migration.

---

*This document should be updated by each agent after completing their tasks.*
