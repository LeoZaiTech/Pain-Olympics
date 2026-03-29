# Progress

## Current Snapshot

As of 2026-03-29, the project is a local browser prototype for `War` mode with
two active setup flows and a much more staged match presentation than the
earlier flat prototype.

- Tech shape: plain `HTML`, `CSS`, and `JavaScript`, served by a small Node
  HTTP server
- Active modes:
  - `Solo`: player builds a curated 40-card deck, then faces a random 40-card
    computer rival
  - `Two-player`: same-browser tag-based setup using the preserved original
    flow
- Current board direction: smoky casino table plus late-night gameshow set
- Current opponent presentation: opponent panel at upper left, portrait
  spotlight at upper right, battlefield in the center, player command and hand
  area at the bottom

## What Is Working Right Now

- main menu with clear mode selection
- solo deck builder with category add/remove, card search, card pick/remove,
  auto-fill, and clear actions
- curated card pool with visible point values and tags
- 5-round match flow
- visible scores, card counts, `challenge`, and `bullshit` counters in player
  panels
- broadcast-style HUD with phase labeling and round progress
- central clash lane that shows primary and follow-up cards
- command tray for lock-in, resolve, tiebreak, next-round, and return-to-menu
  actions
- match log / timeline panel
- Walmart Karen portrait wired into solo mode using the local asset
- fanned hand-card presentation and stronger table/stage atmosphere styling

## Current Rules Snapshot

1. The player chooses `Solo` or `Two-player`.
2. Solo mode builds a 40-card player deck from selected cards plus optional
   auto-fill. Two-player mode generates hands from selected tags.
3. The match runs for 5 rounds.
4. Primary cards determine the default winner by visible point value.
5. A tie, `challenge`, or `bullshit` call pushes the round into follow-up-card
   selection.
6. The winner captures the full point pool from all committed cards.
7. If the follow-up totals are tied, the round ends as a stalemate with no
   points awarded.

## Recent Completed Work

- 2026-03-26: Started a board cleanup pass focused on the in-match HUD and top
  stage composition.
- 2026-03-26: Removed the redundant HUD score strip so score and card counts
  only live in player panels.
- 2026-03-26: Moved the round label into the HUD title area and split the top
  stage into an upper-left opponent panel plus an upper-right portrait card.
- 2026-03-26: Added the prototype opponent portrait slot and wired Walmart
  Karen to the local portrait asset in solo mode.
- 2026-03-26: Verified `node --check app.js`, confirmed the local server over
  `http://127.0.0.1:3000`, and captured fresh menu/match screenshots with a
  local Playwright smoke script.
- 2026-03-29: Tightened the hero copy and upgraded the in-match HUD into a more
  broadcast-style ribbon with explicit phase labeling.
- 2026-03-29: Added a visible round progress meter and clearer side labels
  (`Your Side` / `Opponent`) so match state reads faster.
- 2026-03-29: Added a larger stage-level aesthetic pass with a marquee header,
  deeper show-light background treatment, richer battlefield/table contrast,
  and fanned hand-card presentation.
- 2026-03-29: Refreshed `README.md` and this progress file so the implemented
  prototype state, current rules, and next work areas are documented in one
  place.

## Known Gaps

- onboarding-question-driven deck building is still not implemented
- solo opponents do not yet have authored behavior, banter, or deck themes
- there is no dedicated match-over screen beyond HUD/log messaging
- no persistence, saved decks, or match history
- no mobile-specific polish pass for the newer staged board layout
- no online play, room system, or matchmaking

## Recommended Next Work

- Add a dedicated match-over panel with final score, winner callout, and replay
  options so the match has a stronger finish.
- Deepen solo mode personality by giving the first opponent lightweight banter,
  themed copy, or simple behavior hooks instead of only a random deck.
- Improve mobile readability for the top-stage layout, command tray, and fanned
  hand presentation.
- Replace or augment tag-only deck generation with onboarding-question-driven
  setup so the prototype moves closer to the original product fantasy.

## Notes For The Next Pass

- Keep the current stack lightweight until the board layout and solo flow feel
  stable enough to justify a React/Vite migration.
- The best continuation point is probably either `solo personality` or
  `match-over UX`, because both build directly on the current polished board
  without forcing a large architectural reset.
- The existing visual references live under `Docs/UI Inspirations and
  References/` and are still aligned with the current board direction.

## Verification Notes

- The bundled `develop-web-game` Playwright client was not used for the last UI
  verification pass because it resolved `playwright` relative to the skill
  folder instead of this repo.
- Local Playwright installed in this project remains the fallback smoke-test
  path when browser verification is needed.
