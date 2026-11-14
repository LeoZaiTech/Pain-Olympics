# Pain Olympics

Browser prototype work for a dark-humor card game about personalized decks,
visible point values, and social dispute mechanics. The current build is
focused on making `War` mode readable, playable, and visually closer to the
casino-meets-gameshow board direction documented in the design notes.

## Current Status

- Local prototype built with plain `HTML`, `CSS`, and `JavaScript`
- Served by a tiny Node HTTP server in [`server.js`](./server.js)
- Two playable flows:
  - `Solo`: build a curated 40-card deck, auto-fill the rest, and face a
    computer rival
  - `Two-player`: keep the original same-browser tag-based `War` setup flow
- Match board now includes a marquee header, broadcast-style HUD, round
  progress meter, opponent spotlight, central clash lane, command tray, and
  match log

## Implemented Prototype Features

The current prototype is a lightweight Node-powered web app with local JSON-backed NPC content and Playwright as a dev dependency for smoke testing.

- main menu with `1 Player` and `2 Players`
- solo deck builder with:
  - tag/category filtering
  - add/remove matching cards by category
  - individual card search
  - individual card selection
  - auto-fill to 40 cards
  - clear-deck reset
- curated card pool with visible point values and tag labels
- preserved two-player setup using tag-based deck generation
- solo opponent flow with themed NPC decks (currently `Walmart Karen`)
- local opponent portrait support wired to the current solo NPC
- NPC dialogue integration: pre-match taunts and round-result reactions in match log
- fixed 5-round match structure
- 10-card hands in the current two-player flow
- 40-card decks in solo mode
- hidden-hand toggle flow for duo mode
- human hand visible in solo mode, computer hand concealed
- 3 `challenge` and 3 `bullshit` uses per player
- default round resolution by primary card value
- follow-up-card tiebreak flow for ties and disputes
- round winner captures the total point pool from committed cards
- stalemate outcome when tiebreak totals are equal

## Current Rules Snapshot

1. Choose `Solo` or `Two-player`.
2. Build the player deck for solo mode or pick tags for both players in duo
   mode.
3. Start a 5-round match.
4. Each side locks in a primary card. In solo mode, the computer chooses after
   the human locks in.
5. If one primary card has a higher point value, that side leads by default.
   If the values tie, or a player spends `challenge` or `bullshit`, both sides
   must play a follow-up card.
6. The winner takes the total points from all committed cards. If the tiebreak
   totals match, the round ends in a stalemate.

## What Is Not Built Yet

- onboarding-question-driven deck generation
- dedicated match-over screen or tournament progression
- persistence, save data, or match history
- online multiplayer, matchmaking, or room codes
- React/Vite migration

## Project Map

- [`README.md`](./README.md): current project snapshot
- [`progress.md`](./progress.md): recent completed work and recommended next tasks
- [`ARCHITECTURE.md`](./ARCHITECTURE.md): static vs dynamic HTML, render flow, how to add things
- [`AGENTS.md`](./AGENTS.md): instructions for AI coding agents (Windsurf, Codex, Claude Code)
- [`Starting Deck.md`](./Starting%20Deck.md): raw card and deck ideation
- [`Brainstorming and Conceptualizing.md`](./Brainstorming%20and%20Conceptualizing.md): Q&A on tone, audience, rules, visual direction
- [`Pain Olympics MVP Scope.md`](./Pain%20Olympics%20MVP%20Scope.md): original MVP scope and staged build plan
- [`index.html`](./index.html): screen structure and match-board markup
- [`styles.css`](./styles.css): full prototype styling and board presentation
- [`data.js`](./data.js): TAGS, CARD_POOL, SETTINGS constants (edit here to add cards)
- [`app.js`](./app.js): state, rendering, and match logic
- [`data/npc-decks.json`](./data/npc-decks.json): runtime NPC deck definitions
- [`data/npc-dialogue.json`](./data/npc-dialogue.json): runtime NPC taunts and reactions
- [`Docs/NPC Profiles/`](./Docs/NPC%20Profiles/): NPC design specs
- [`Docs/UI Inspirations and References/`](./Docs/UI%20Inspirations%20and%20References/): local prototype art assets (the NPC portrait is a placeholder)
- [`Docs/REACT_MIGRATION_PLAN.md`](./Docs/REACT_MIGRATION_PLAN.md): future React + Vite migration roadmap
- [`Docs/AI_AGENT_SETUP.md`](./Docs/AI_AGENT_SETUP.md): AI workflow configuration and automation pipelines

## Run It

From the project folder:

```bash
npm start
```

Then open:

```text
http://127.0.0.1:3000
```

`npm run dev` currently points to the same local server command.

Optional environment overrides:

- `PORT`
- `HOST`

## Quick Verification

If you want a lightweight sanity check after edits:

```bash
node --check app.js
node --check server.js
```

The repo also includes `playwright` for local smoke-testing work, but it is not
required to run the prototype server.
