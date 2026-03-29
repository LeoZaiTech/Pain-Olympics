# Windsurf → Codex: Task Allocation for Pain Olympics

**From:** Windsurf/Cascade  
**To:** Codex  
**Re:** Dividing implementation work based on agent strengths  
**Date:** 2026-03-26

## Status Update

**Update as of 2026-03-27:**
- `Walmart Karen` is no longer just a concept task.
- Her profile exists in `Docs/NPC Profiles/Walmart Karen.md`.
- Her deck and dialogue exist in `data/npc-decks.json` and `data/npc-dialogue.json`.
- She is already wired into live solo mode in `app.js`.

Treat that work as complete and use it as the template for the next NPC/content pass.

---

## Context

We're both working on Pain Olympics—a dark-humor card game prototype. The current build is vanilla HTML/CSS/JS with a Node server. The vision is: **smoky casino card table + late-night game show staging + Pokemon-style battle layout + premium hybrid card design**.

I've reviewed the full codebase, reference images, and design docs. Below is my assessment of which changes each of us should tackle based on our respective strengths.

---

## Tasks for Codex (You)

These are **batch generation, isolated modules, and spec-driven tasks** where your strength in generating large amounts of well-structured code from clear specs shines:

### 1. Card Pool Expansion
Generate 50–100 new cards for `CARD_POOL` in `app.js`. Specs:
- Follow existing structure: `{ id, title, points, tags }`
- Use kebab-case for IDs derived from title
- Point range: 4–9 (see existing distribution)
- Tags: `family`, `identity`, `health`, `internet`, `culture`, `religion`, `collapse`, `work`
- Tone: Gallows humor, not cruelty. Short phrases or punchy one-liners.
- Reference `Starting Deck.md` for card ideas already ideated

### 2. NPC Opponent Deck Generation
Create themed 40-card decks for specific NPCs:
- **Mall Karen** — entitled customer energy
- **Officer Brady** — authority figure trauma
- **AI Support Unit** — support tickets from hell + resentful system logs
- **The Doomscroll Oracle** — internet/collapse prophet

Each deck should be a curated subset or new cards weighted toward that NPC's theme.
`Walmart Karen` is already done enough to use as the pattern.

### 3. Prompt Mode Card Generation (Future)
When ready, generate CAH-style black card prompts that pair with existing trauma cards. Specs TBD but you'd be ideal for batch-generating 50+ prompts.

### 4. Test Suite Scaffolding
Generate a test file (Jest or Vitest) covering:
- `shuffle()` — randomness distribution
- `compareCards()` — winner logic
- `buildHandFromTags()` — tag filtering
- `finalizeRound()` — score calculation
- State transitions between phases

### 5. Data Model Extraction
Extract `TAGS`, `CARD_POOL`, and `SETTINGS` from `app.js` into a separate `data.js` module with proper exports. Clean separation, no logic changes.

### 6. NPC Dialogue/Banter JSON
Generate a JSON structure for NPC pre-match taunts, win reactions, and loss reactions:
```json
{
  "walmart-karen": {
    "preTaunts": ["...", "..."],
    "winLines": ["...", "..."],
    "lossLines": ["...", "..."]
  }
}
```
This now exists for `walmart-karen`; next work should expand it to additional NPCs.

---

## Tasks for Windsurf/Cascade (Me)

These require **interactive debugging, visual verification, multi-file coordination, and iterative refinement**:

### 1. Match Board Atmosphere Overhaul
Push the dark casino aesthetic harder:
- Deepen `.match-board` gradient (more green felt, burgundy contrast)
- Add vignette overlay
- Strengthen radial glow behind `.versus-badge`
- Add subtle noise/grain texture to board

*Why me:* Requires previewing in browser, tweaking values, visual judgment calls.

### 2. Card Tactile Treatment
Upgrade `.hand-card`, `.played-card`, `.library-card`:
- Add paper texture background
- Thicker decorative inner border (double-line treatment)
- Subtle emboss/deboss shadow on corners
- Slight card tilt on hover

*Why me:* CSS iteration with live preview, balancing subtle effects.

### 3. Portrait Spotlight Effect
Make `.opponent-portrait` feel more "game show":
- Rim lighting / glow behind frame
- Subtle pulsing animation on match start
- Nameplate styling upgrade

*Why me:* Animation timing, visual polish, cross-browser testing.

### 4. Card Reveal Animation
Add flip/reveal animation when cards lock in:
- Face-down card state
- 3D flip transition on reveal
- Clash impact effect when cards meet

*Why me:* Keyframe animation tuning, JavaScript trigger coordination.

### 5. React/Vite Migration
When layout stabilizes, port to React:
- Component extraction
- State management (Zustand or context)
- Build tooling setup

*Why me:* Multi-file refactor, dependency management, debugging build issues.

### 6. Responsive Polish
Fix mobile breakpoints:
- Command tray overflow
- Card hand horizontal scroll UX
- Portrait panel stacking

*Why me:* Device testing, interactive layout debugging.

### 7. Server Error Handling
Fix the `EADDRINUSE` issue—either kill orphan processes or add port-finding fallback to `server.js`.

*Why me:* Requires running commands, checking processes, iterating on fix.

---

## Shared/Collaborative Tasks

Some work benefits from both of us:

| Task | Codex Does | Windsurf Does |
|------|-----------|---------------|
| New NPC opponent | Generate deck JSON + dialogue | Wire into `SETTINGS`, add portrait, test flow |
| Card styling | — | All CSS work |
| Card content | Generate titles + points | Review, tweak phrasing, balance |
| Test suite | Generate test scaffolding | Run tests, debug failures |
| Refactor | Generate extracted modules | Integrate, verify nothing breaks |

---

## Suggested Workflow

1. **Codex pass:** Extract the main inline game data and/or create the second NPC pack
2. **Windsurf integration/polish:** I verify the new content against the live build and keep pushing the board feel
3. **Codex test pass:** Generate test scaffolding once the data shape is cleaner
4. **Windsurf styling:** I tackle atmosphere/card/animation polish
5. **Iterate:** You refine content based on my visual feedback

---

## Files You'll Need

- `app.js` — Current card pool, settings, game logic (lines 1–300 for data, rest is logic)
- `Starting Deck.md` — Raw card ideas to pull from
- `Brainstorming and Conceptualizing.md` — Tone guidelines, NPC personality specs
- `Pain Olympics MVP Scope.md` — Feature boundaries

---

## Questions for You, Codex

1. Can you generate the second NPC pack in the same `profile + npc-decks.json + npc-dialogue.json` pattern as Karen?
2. Do you want to extract `TAGS`, `CARD_POOL`, and `SETTINGS` before or after the second NPC pack?
3. When you do the test pass, do you want to keep it lightweight first or scaffold a fuller suite immediately?

---

Looking forward to your output. I'll handle the visual/interactive side while you crank out content and structure.

— Windsurf/Cascade
