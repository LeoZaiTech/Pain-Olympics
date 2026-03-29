# Pain Olympics – Codex Context Document

Use this document to quickly onboard Codex, Cursor, Windsurf, or any code-focused AI to the project for implementation work.

---

## Project Overview

**Pain Olympics** — A browser-based dark-humor card game prototype.

| Aspect | Current State |
|--------|---------------|
| Stack | Vanilla HTML + CSS + JS, Node.js server |
| Entry point | `index.html` served by `server.js` on port 3000 |
| Styles | `styles.css` (1000+ lines, CSS variables, responsive) |
| Logic | `app.js` (1400+ lines, all game state + rendering) |
| Assets | `Docs/UI Inspirations and References/` |
| NPC content | `data/npc-decks.json` + `data/npc-dialogue.json` loaded at runtime for solo opponents |
| Live NPC | `Walmart Karen` is fully wired into solo mode with a themed deck subtitle and match-log dialogue |

---

## Run Commands

```bash
npm start        # Runs server.js on http://127.0.0.1:3000
npm run dev      # Same, for dev workflows
```

---

## Architecture

### State Management

All state lives in a single `state` object in `app.js`:

```javascript
const state = {
  screen: "menu" | "match",
  mode: "solo" | "duo" | null,
  round: 1,
  maxRounds: 5,
  phase: "menu" | "selecting" | "revealed" | "tiebreak-selecting" | "resolved" | "match-over",
  players: [Player, Player],
  roundState: RoundState,
  log: LogEntry[],
  npcContent: { decks, dialogue, status, error },
  soloBuilder: { selectedCardIds: Set },
};
```

### Key Data Structures

**Card:**
```javascript
{ id: string, title: string, points: number, tags: string[] }
```

**Player:**
```javascript
{
  name, tags, score, hand: Card[],
  isComputer, handVisible, subtitle,
  portraitSrc, portraitAlt, npcKey,
  selectedCardId, followUpCardId,
  challengesLeft, bullshitLeft
}
```

**RoundState:**
```javascript
{
  primarySelections: [Card, Card],
  followUpSelections: [Card, Card],
  disputeType: "challenge" | "bullshit" | null,
  disputeBy: 0 | 1 | null,
  defaultWinnerIndex, winnerIndex, poolPoints
}
```

---

## CSS Architecture

**CSS Variables (`:root`):**
- `--paper`, `--paper-strong` — Light backgrounds
- `--ink`, `--ink-soft` — Text colors
- `--accent`, `--accent-dark` — Orange/rust primary
- `--teal`, `--gold`, `--danger` — Accent palette
- `--panel`, `--panel-soft` — Glassmorphism backgrounds

**Key Classes:**
- `.panel`, `.panel-soft` — Card/section containers
- `.hero` — Landing header
- `.mode-card`, `.library-card`, `.hand-card`, `.played-card` — Card variants
- `.match-board` — Dark match arena container
- `.top-stage`, `.battlefield-panel`, `.player-shell` — Match layout sections
- `.opponent-portrait` — NPC portrait panel
- `.command-tray` — Action buttons during match

**Responsive Breakpoints:** 1180px, 980px, 760px

---

## Game Flow

1. **Menu screen** → User picks Solo or Duo
2. **Solo setup** → Build 40-card deck from library, auto-fill if needed
3. **Duo setup** → Both players pick tags, generate 10-card hands
4. **Match starts** → `startMatch()` initializes players, enters `selecting` phase
5. **Each round:**
   - Players select primary cards (`phase: selecting`)
   - Lock in → `lockInPrimaryCards()` → `phase: revealed`
   - Resolve or dispute → `resolveRound()` or `beginDispute()`
   - If dispute/tie → `phase: tiebreak-selecting` → follow-up cards
   - `finalizeRound()` → scores updated, cards removed from hands
   - `advanceRound()` or `phase: match-over`
6. **Reset** → `resetMatchToMenu()`

### Solo Opponent Content Flow

1. `initializeNpcContent()` fetches `data/npc-decks.json` and `data/npc-dialogue.json`
2. Solo setup waits for NPC content before enabling `Start Solo Match`
3. `createComputerPlayer()` builds the opponent from the configured NPC pack
4. `buildNpcDeck()` merges curated main-pool cards, NPC-exclusive cards, and filler cards to reach 40
5. `startMatch()` logs a pre-taunt
6. `finalizeRound()` logs the NPC's win/loss reaction

---

## File Map

```
Pain Olympics/
├── index.html          # Single-page app shell
├── styles.css          # All styles
├── app.js              # All JS logic + card pool
├── server.js           # Simple Node static server
├── package.json        # npm scripts
├── data/
│   ├── npc-decks.json
│   └── npc-dialogue.json
├── Docs/
│   ├── AI Analysis and Dialog/
│   │   ├── chatgpt.md
│   │   ├── codex.md
│   │   ├── windsurf-to-codex.md
│   │   └── workflow-sequence.md
│   ├── NPC Profiles/
│   │   └── Walmart Karen.md
│   └── UI Inspirations and References/
│       ├── Assets/
│       │   └── Walmart Karen.png
│       ├── Dungeons and Degenerates Card Style 1.png
│       ├── Inscryption Card Style 1.png
│       ├── Inscryption Card Style 2.png
│       ├── Chefs Luv Shack Gameshow style background reference.jpg
│       └── Pokemon Reference Battle Styling.png
├── Brainstorming and Conceptualizing.md
├── Pain Olympics MVP Scope.md
├── Starting Deck.md
├── README.md
└── progress.md
```

---

## Current Agent Priorities

1. Extract the large inline data structures from `app.js` into a dedicated data module/folder.
2. Use the `Walmart Karen` pack as the template for the next NPC pack.
3. Add tests around round resolution, state transitions, and NPC deck construction.
4. Keep visual polish work separate from content/data refactors when possible.

---

## Visual Target (For Styling Work)

**Match board mood:** Smoky casino + late-night game show
**Card style:** CAH bluntness + premium playing card framing (corners, borders)
**Layout:** Pokemon battle style (opponent top, arena center, hand bottom)
**Portrait panel:** Upper-right spotlight for NPC, nameplate + icon first

**Key references:**
- Dungeons & Degenerates — casino felt, dark contrast, stat badges
- Inscryption — gritty card textures, dramatic lighting
- Chef's Luv Shack — game show staging, contestant panels
- Pokemon battles — vertical axis layout, HP-style stat displays

---

## Common Implementation Tasks

### Add a new card to the pool

In `app.js`, add to `CARD_POOL`:
```javascript
{
  id: "new-card-id",
  title: "Card Title Here",
  points: 6,
  tags: ["tag1", "tag2"],
},
```

### Add a new NPC opponent

Add the content pack to:
- `data/npc-decks.json`
- `data/npc-dialogue.json`

Then point `SETTINGS.defaultComputerOpponentKey` or future selection logic at that NPC key.

### Add a new tag category

In `app.js`, add to `TAGS`:
```javascript
{ id: "newtag", label: "Display Label" },
```

### Modify card styling

Cards use `.library-card`, `.hand-card`, `.played-card` classes. Inner structure uses:
- `.card-frame` — Grid wrapper
- `.card-topline` / `.card-bottomline` — Corner values and tags
- `.card-body` — Title area with "PO" watermark
- `.card-corner` — Point value badges

### Modify match board styling

`.match-board` controls the dark arena. Key sub-sections:
- `.top-stage` — Opponent panel + portrait
- `.battlefield-panel` — Clash zone with played cards
- `.player-shell` — Command tray + player hand

---

## Known TODOs

- [ ] React/Vite migration once layout stabilizes
- [ ] Card flip/reveal animations
- [ ] More NPC opponents with unique JSON deck/dialogue packs
- [ ] Prompt mode (CAH-style)
- [ ] Online multiplayer (post-MVP)

---

## Quick Prompts to Copy

**Add cards:**
> "Add these 5 cards to CARD_POOL in app.js: [list]. Assign appropriate point values and tags."

**Style adjustment:**
> "Make the .played-card feel more like a physical deck card. Add texture, thicker borders, and subtle shadow."

**New opponent:**
> "Create a new JSON-backed NPC pack called 'Mall Karen' with a profile doc, deck data, and dialogue data that follow the Walmart Karen pattern."

**Animation:**
> "Add a CSS flip animation when cards are revealed in the battlefield. Trigger it when phase changes to 'revealed'."

**Refactor:**
> "Extract the card rendering logic from app.js into a separate cards.js module."
