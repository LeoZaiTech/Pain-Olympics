Original prompt: Clean up the match UI by removing the Match State label and redundant score cards, moving the opponent panel to the upper left, adding the Walmart Karen portrait to the upper right, and continuing to flesh out the browser build.

- 2026-03-26: Started a board cleanup pass focused on the in-match HUD and top-stage composition.
- 2026-03-26: Planned removal of the redundant HUD scoreboard so score and card counts only live in player panels.
- 2026-03-26: Removed the redundant in-match score-card strip, moved the round label into the HUD title slot, and split the top stage into an upper-left opponent panel plus an upper-right portrait card.
- 2026-03-26: Added a prototype opponent portrait slot and wired Walmart Karen to use the local asset in solo mode.
- 2026-03-26: Verified `node --check app.js`, confirmed the served HTML over `http://127.0.0.1:3000`, and captured fresh menu/match screenshots with an elevated local Playwright smoke script after installing the required browser.
- Note: The bundled `develop-web-game` Playwright client could not be used directly because it resolves `playwright` relative to the skill folder instead of this project; local Playwright was used as the fallback verification path.
- 2026-03-26: Created a first `Walmart Karen` character pack with a behavior-focused NPC spec, starter deck data, and dialogue JSON for future app integration.
- 2026-03-26: Expanded the Walmart Karen exclusive card set with user-supplied grievance/persecution cards and lightly sanitized one hateful line into `Q-slur` wording for safer project use.
- 2026-03-26: Planned next step: wire the Walmart Karen deck pack and dialogue JSON into the live solo-mode flow so the first NPC opponent actually plays and talks like herself.
- 2026-03-26: Integrated Walmart Karen's JSON deck and dialogue into solo mode. Solo setup now waits for NPC content to load, the opponent uses the themed subtitle/deck pack, and the match log now shows Karen taunts plus win/loss reactions during play.
- 2026-03-26: Verified the integration with `node --check app.js`, live JSON fetches from the local server, and elevated Playwright smoke passes covering match start and one resolved round with no page errors.
- 2026-03-27: Refreshed the shared documentation so README + AI handoff docs now reflect the live Walmart Karen integration, the runtime NPC JSON files, and the current next-agent priorities.
- TODO: Revisit React/Vite migration once the board layout and solo flow feel stable enough to port cleanly.
- TODO: Extract `TAGS`, `CARD_POOL`, and `SETTINGS` from `app.js` into a dedicated data module or folder.
- TODO: Create the second NPC pack using the Walmart Karen JSON/profile pattern.
- TODO: Add a real test harness for core game-state utilities and round resolution.
