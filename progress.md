Original prompt: Clean up the match UI by removing the Match State label and redundant score cards, moving the opponent panel to the upper left, adding the Walmart Karen portrait to the upper right, and continuing to flesh out the browser build.

- 2026-03-26: Started a board cleanup pass focused on the in-match HUD and top-stage composition.
- 2026-03-26: Planned removal of the redundant HUD scoreboard so score and card counts only live in player panels.
- 2026-03-26: Removed the redundant in-match score-card strip, moved the round label into the HUD title slot, and split the top stage into an upper-left opponent panel plus an upper-right portrait card.
- 2026-03-26: Added a prototype opponent portrait slot and wired Walmart Karen to use the local asset in solo mode.
- 2026-03-26: Verified `node --check app.js`, confirmed the served HTML over `http://127.0.0.1:3000`, and captured fresh menu/match screenshots with an elevated local Playwright smoke script after installing the required browser.
- Note: The bundled `develop-web-game` Playwright client could not be used directly because it resolves `playwright` relative to the skill folder instead of this project; local Playwright was used as the fallback verification path.
- TODO: Revisit React/Vite migration once the board layout and solo flow feel stable enough to port cleanly.
- 2026-03-29: Ran another match-board polish pass to better match the documented casino-meets-gameshow vision by tightening hero copy, upgrading the in-match HUD to a broadcast-style ribbon with explicit phase labeling, and improving board atmosphere styling.
- 2026-03-29: Added a visible round progress meter to the HUD and clearer side labels (`Your Side` / `Opponent`) in player panels so match state reads more obviously during testing.
- 2026-03-29: Added a larger stage-level aesthetic pass with a marquee header, deeper show-light background treatment, richer battlefield/table contrast, and fanned hand-card presentation to push closer to the documented casino-meets-gameshow vision.
