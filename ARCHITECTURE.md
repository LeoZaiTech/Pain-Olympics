# Pain Olympics Architecture

This document explains how the codebase is structured, which HTML is static vs
dynamically rendered, and how to make changes safely.

## File Overview

| File | Purpose | Safe to Edit Directly? |
|------|---------|------------------------|
| `index.html` | Static shell with container elements | Yes, but see caveats below |
| `data.js` | Game data constants (TAGS, CARD_POOL, SETTINGS) | Yes - this is where card/NPC content goes |
| `app.js` | Game logic, state, and rendering | Yes, but changes cascade |
| `styles.css` | All visual styling | Yes |
| `data/npc-decks.json` | NPC deck definitions loaded at runtime | Yes |
| `data/npc-dialogue.json` | NPC taunts and reactions | Yes |

## Static vs Dynamic HTML

**Critical concept:** The HTML in `index.html` defines *containers*, but many of
these containers have their `innerHTML` *completely replaced* by JavaScript
render functions on every state change.

### Static Elements (safe to edit in index.html)

These elements keep their HTML structure:

- `#hero-panel` - Main menu hero section
- `#menu-screen` - Mode selection buttons
- `#solo-screen` - Solo setup form structure
- `#two-player-screen` - Duo setup form structure
- `#hud-panel` - HUD ribbon (but some children are dynamic)
- `#log-panel` - Log container (list items are dynamic)

### Dynamic Elements (innerHTML replaced by app.js)

**Do NOT add content to these in index.html** — it will be overwritten:

| Container | Render Function | What Gets Replaced |
|-----------|-----------------|-------------------|
| `#player-0-panel` | `renderPlayerPanel(0)` | Entire panel contents |
| `#player-1-panel` | `renderPlayerPanel(1)` | Entire panel contents |
| `#opponent-portrait` | `renderOpponentPortrait()` | Portrait frame + caption |
| `#played-0-slot` | `renderPlayedCards()` | Card display |
| `#played-1-slot` | `renderPlayedCards()` | Card display |
| `#solo-card-library` | `renderSoloBuilder()` | Card list |
| `#solo-selected-cards` | `renderSoloBuilder()` | Selected cards list |
| `#match-log` | `renderLog()` | Log entries |
| `#round-summary` | `renderRoundSummary()` | Summary text |

### Hybrid Elements

These have static structure but dynamic children:

- `#solo-tag-grid` - Checkboxes built by `buildTagInputs()`
- `.duo-tag-grid` - Checkboxes built by `buildTagInputs()`

## Render Flow

```
User action or state change
         ↓
    render() called
         ↓
┌────────────────────────────────┐
│ renderScreenVisibility()       │ ← Shows/hides panels
│ renderSoloBuilder()            │ ← Rebuilds card library
│ renderStageText()              │ ← Updates HUD labels
│ renderPlayerPanel(0)           │ ← Rebuilds player 0 panel
│ renderPlayerPanel(1)           │ ← Rebuilds player 1 panel
│ renderOpponentPortrait()       │ ← Rebuilds portrait
│ renderPlayedCards()            │ ← Updates battlefield
│ renderRoundSummary()           │ ← Updates summary text
│ renderButtons()                │ ← Enables/disables buttons
│ renderLog()                    │ ← Rebuilds log entries
└────────────────────────────────┘
```

## How to Add Things

### Adding a New Card

Edit `data.js`:

```js
// In CARD_POOL array:
{
  id: "unique-slug",
  title: "Card Display Title",
  points: 6,
  tags: ["family", "health"],  // Must match TAGS ids
}
```

### Adding a New Tag

Edit `data.js`:

```js
// In TAGS array:
{ id: "new-tag", label: "Display Label" }
```

### Adding a New NPC

1. Add to `SETTINGS.computerOpponents` in `data.js`
2. Add deck to `data/npc-decks.json`
3. Add dialogue to `data/npc-dialogue.json`
4. Optionally add portrait image and profile doc

### Changing Card Appearance

Edit `styles.css`. Key classes:

- `.card-frame` - Card container
- `.card-title` - Title text
- `.card-badge` - Points badge
- `.card-tag-list` - Tag pills
- `.hand-card` - Cards in hand
- `.played-card` - Cards on battlefield

### Adding a New UI Element to Match Screen

1. Add container in `index.html` inside `#match-area`
2. Add query to `elements` object in `app.js`
3. Create render function or add to existing one
4. Call from `render()` function
5. Style in `styles.css`

## State Shape

The `state` object in `app.js` drives everything:

```js
{
  screen: "menu" | "solo-setup" | "duo-setup" | "match",
  mode: null | "solo" | "duo",
  players: [Player, Player],
  round: 1,
  maxRounds: 5,
  phase: "menu" | "selecting" | "revealed" | "tiebreak-selecting" | "resolved" | "match-over",
  roundState: { ... },
  log: [{ message, timestamp }],
  soloBuilder: { selectedCardIds, tagFilters }
}
```

## CSS Architecture

- CSS variables defined in `:root`
- `body[data-screen="match"]` selector for match-specific styles
- Mobile breakpoints at bottom of file
- Card styling uses `.card-frame` as base class

## React Migration Notes

When migrating to React:

1. Each render function becomes a component
2. `state` object becomes React state or context
3. `elements` object goes away (use refs only where needed)
4. Event listeners become onClick props
5. `data.js` can become ES modules with named exports
6. Consider splitting into:
   - `components/` - UI components
   - `hooks/` - Custom hooks for game logic
   - `data/` - Card pool, tags, settings
   - `utils/` - Helper functions
