# Progress

---

## Active Prototype: Version B — Pokemon Battle Edition

**Started:** 2026-04-07
**Stack:** Phaser 3 (v3.90) + Vite (v6.3), ES modules, Press Start 2P font
**Server:** `http://127.0.0.1:3002` via Vite dev server
**Location:** `/prototypes/version-b-pokemon/`

### What Is Working Right Now

- **Boot → Menu → Deck Builder → Battle** full scene flow with clean transitions
- **Deck Builder screen** — tabbed pool browser (◄► to switch tabs);
  main pool tab (51 cards) + expansion pack tab (The Legend of Black Sparrow,
  11 cards); scrollable list, checkbox toggle, shared 0/40 counter,
  Auto-fill, Clear All, and Start Battle actions; hold-to-scroll with 320ms
  delay and 65ms repeat rate; 80ms input cooldown on scene entry prevents
  key-leak from previous scene; dual-listed cards show ★ ALSO IN MAIN badge
- **Full card titles visible** — no truncation on either the deck builder or
  the in-battle card picker; all titles fit on one line at their respective
  font sizes
- **Battle scene** — light mint sky + vibrant green ground palette; white status
  boxes; Walmart Karen portrait; pixel-art player sprite; ROUND X label
- **HP system** — each player starts at 100 HP; round pool points deal damage
  to the loser; match ends when any player reaches 0 HP (no round limit)
- **HP bars** — color-coded: green >50%, yellow 25-50%, red <25%;
  name + HP only in status boxes (no extra token dot clutter)
- **Always-4 action menu** — FIGHT / CHALLENGE X/3 / CALL BS X/3 / FORFEIT
  visible at all times; CHALLENGE and CALL BS grey out in the selecting phase,
  become active after cards are revealed; cursor auto-skips disabled items
- **Typewriter dialogue** — character-by-character reveal with skip-ahead on
  confirm; blinking arrow when waiting for input
- **Space bar** added as a third confirm key alongside Enter and Z
- **Walmart Karen NPC** — curated 40-card deck (4 main-pool base + 19
  Karen-exclusive cards); pre-taunt, win, and loss dialogue lines (7 loss
  lines; pre-taunt #2 fixed)

### Current Rules (Version B)

1. Player builds a deck from the 51-card main pool and/or expansion packs in
   the Deck Builder screen. Choosing fewer than 40 auto-fills from remaining cards.
2. Battle starts. Karen's deck is built from her 4 base cards + 19 exclusives +
   random main-pool filler to 40.
3. Each player starts at 100 HP. There is no round limit.
4. Both players secretly pick a primary card. Higher point value wins by default.
5. Player may ACCEPT, CHALLENGE (3 uses), CALL BS (3 uses), or FORFEIT.
6. A dispute or tie triggers a follow-up card round. Combined totals decide.
7. The round winner deals the full card pool's point total as HP damage to the
   loser. Stalemates deal no damage.
8. First player to reach 0 HP loses.

### Recent Completed Work (Version B)

- 2026-04-07: Scaffolded Phaser 3 + Vite prototype, BootScene, MenuScene,
  BattleScene with full game loop, Walmart Karen NPC, and typewriter dialogue.
- 2026-04-07: Pushed initial prototype to `LeoZaiTech/Pain-Olympics` repo.
- 2026-04-07: Replaced score system with 100 HP per player; round pool points
  become damage; match ends on KO.
- 2026-04-07: Rebuilt battle scene with lighter palette (mint sky, green
  ground, white panels); HP bars with color coding; Space bar confirm; always-4
  action menu with disabled state; WALMART KAREN name truncation fixed.
- 2026-04-07: Built DeckBuildScene with scrollable card list, checkbox
  selection, counter, Auto-fill / Clear / Start Battle actions, and hold-repeat
  scrolling.
- 2026-04-07: Wired Menu → DeckBuildScene → BattleScene scene flow;
  BattleScene accepts `playerDeck` from DeckBuildScene init data.
- 2026-04-07: Removed CHAL/BS dots from HP status boxes (covered by action
  menu labels); tightened box height to 44px.
- 2026-04-07: Removed 5-round cap from finalizeRound — match now ends only on
  KO (hp ≤ 0).
- 2026-04-07: Removed all card title truncation from Deck Builder and
  in-battle card picker.
- 2026-04-07: Overhauled Walmart Karen's exclusive card list — removed
  thematically loose cards, renamed/repointed existing cards, added three new
  manager-cluster cards; deck trimmed to 4 base + 14 exclusives.
- 2026-04-07: Expanded Karen's exclusive card list to 19 (+5 new cards
  including Got Filmed Without Permission and Now I'm a Meme); added 7th
  loss line; fixed pre-taunt #2 punctuation.
- 2026-04-24: Added first Expansion Pack — "The Legend of Black Sparrow"
  (11 cards: 8 pack-exclusive + 3 dual-listed in main pool); added 3 new
  main-pool cards (Gate Program Kid, DARE betrayal, McGruff); main pool
  now 51 cards.
- 2026-04-24: Rebuilt DeckBuildScene with tab-based pool browser — ◄► to
  switch between MAIN POOL and expansion tabs; shared selection counter;
  dual-listed cards show ★ ALSO IN MAIN badge; auto-fill draws from all
  pools combined.
- 2026-04-24: Added second Expansion Pack — "Jewels The Film Major"
  (21 cards: 15 pack-exclusive + 6 dual-listed in main pool); added 6 new
  main-pool cards (Emotionally Unavailable Parents, Alcoholic Dad, 4+ Years
  in College Still Broke, 8+ Years in College Still Broke, Neurodivergent
  Mental Disorder Combo Pack, Grippy Sock Vacation); main pool now 57 cards.
- 2026-04-24: Updated Black Sparrow pack (+2 cards: Victimized by Food and
  Bev exclusive, Emotionally Unavailable Parents dual-listed); pack now
  13 cards.

### Known Gaps (Version B)

- No animated HP damage flash when a round resolves
- No sound
- No mobile layout pass
- Deck Builder has no search or tag filter
- Battle card picker shows full hand (no fog-of-war since it's solo)
- No match history or rematch flow after KO
- Walmart Karen dialogue needs expansion (mid-round lines, challenge reactions)
- Expansion pack cards cannot currently appear in Karen's NPC deck fill
- No persist of last-used deck between sessions

### Recommended Next Work (Version B)

- Add a second NPC (next archetype or AI opponent — see NPC Backlog)
- HP damage flash / shake animation on round resolve
- Deck Builder tag filter and search
- Persist last-used deck in localStorage so players don't rebuild every session
- Match-over screen with final HP totals and replay option
- Expand Karen's dialogue (mid-round lines, challenge/BS reactions)
- Add more expansion packs as more personal card sets are designed

---

## Legacy Prototype: Original Browser Build

**Stack:** Plain HTML / CSS / JS, Node HTTP server
**Server:** `http://127.0.0.1:3000`
**Location:** root of repo

### What Is Working

- main menu with Solo and Two-player mode selection
- solo deck builder with category add/remove, card search, auto-fill, clear
- curated 48-card pool with visible point values and tags
- 5-round War mode match flow
- challenge and bullshit counters in player panels
- broadcast-style HUD with phase labeling and round progress
- central clash lane showing primary and follow-up cards
- match log / timeline panel with NPC dialogue
- Walmart Karen NPC with portrait, themed deck, and dialogue
- fanned hand-card presentation

### Status

Stable but not actively developed. Kept as reference for game logic and card
data. Version B Pokemon prototype is the active development track.

---

## Shared Card Pool Snapshot (as of 2026-04-24)

57 cards across 8 tags: Family Systems, Identity, Mental Health,
Internet Damage, Cultural Baggage, Religious Trauma, Collapse Dread,
Work and Class. Points range from 4 (lighter) to 9 (heaviest).

Added 2026-04-24 (Black Sparrow cross-list): Gate Program Kid (5pt),
Betrayed by DARE's Promises of Free Drugs as a Kid (5pt), Disappointed
McGruff the Crime Dog (5pt).

Added 2026-04-24 (shared with Black Sparrow + Jewels):
Emotionally Unavailable Parents (7pt).

Added 2026-04-24 (Jewels cross-list): Alcoholic Dad (7pt), 4+ Years in
College Still Broke (5pt), 8+ Years in College Still Broke (6pt),
Neurodivergent Mental Disorder Combo Pack (7pt), Grippy Sock Vacation (7pt).

## Expansion Packs (as of 2026-04-24)

| Pack | Tab Label | Cards | Notes |
|---|---|---|---|
| The Legend of Black Sparrow | BLACK SPARROW | 13 | 9 exclusive + 4 dual-listed |
| Jewels The Film Major | FILM MAJOR | 21 | 15 exclusive + 6 dual-listed |

### The Legend of Black Sparrow — Card List

| Title | Points | Tags | Notes |
|---|---|---|---|
| Got Roofied, Continued Drinking to Even It Out | 7 | health, culture | exclusive |
| Lost in the Foster System | 8 | family, work | exclusive |
| Adopted by Unaffectionate Parents | 7 | family | exclusive |
| Moved from West Coast to East Coast, Still Poor | 5 | work, culture | exclusive |
| Drug Addicted Mother | 8 | family, health | exclusive |
| Father on Most Wanted List | 7 | family, collapse | exclusive |
| Only Attracted to Unstable Partners | 6 | health, identity | exclusive |
| I ❤ Women with BPD | 6 | health, identity | exclusive |
| Victimized by Food and Bev | 6 | work, culture | exclusive |
| Gate Program Kid | 5 | identity, culture | also in main pool |
| Betrayed by DARE's Promises of Free Drugs as a Kid | 5 | culture, collapse | also in main pool |
| Disappointed McGruff the Crime Dog | 5 | culture, collapse | also in main pool |
| Emotionally Unavailable Parents | 7 | family, health | also in main pool + Jewels |

### Jewels The Film Major — Card List

| Title | Points | Tags | Notes |
|---|---|---|---|
| Got a Job Working on a Movie, Ended Up in a Cult | 8 | culture, collapse | exclusive |
| 9 Years in College Still Broke | 7 | work, culture | exclusive |
| Dad Recovers from Alcoholism, Gets Cancer | 9 | family, health | exclusive |
| Grew Up Fat and Asian in the 2000s | 7 | identity, culture | exclusive |
| Grew Up Asian in the 2000s | 6 | identity, culture | exclusive |
| Grew Up Fat in the 2000s | 6 | identity, culture | exclusive |
| Grew Up Republican | 5 | identity, culture | exclusive |
| Bipolar, Autistic, OCD and Probably BPD | 8 | health, identity | exclusive |
| Had an Eating Disorder, Still Fat | 7 | health, identity | exclusive |
| Multiple Ambulance Calls for Public Panic Attacks | 7 | health, identity | exclusive |
| Lord of the Rings Trilogy: Grippy Socks Chronicles | 8 | health, culture | exclusive |
| Mental Hospital, Self-Harm, Nobody Was Aware | 9 | health, family | exclusive |
| Watched Grandmother Die, Had to Take PTO for the Funeral | 8 | family, work | exclusive |
| Got in a Car Wreck, Grandad Died a Week Later | 8 | family, collapse | exclusive |
| Both Godparents Have Cancer (Sadly Not Fairies) | 8 | family, health | exclusive |
| Emotionally Unavailable Parents | 7 | family, health | also in main pool + Black Sparrow |
| Alcoholic Dad | 7 | family, health | also in main pool |
| 4+ Years in College Still Broke | 5 | work, culture | also in main pool |
| 8+ Years in College Still Broke | 6 | work, culture | also in main pool |
| Neurodivergent Mental Disorder Combo Pack | 7 | health, identity | also in main pool |
| Grippy Sock Vacation | 7 | health | also in main pool |

### Mechanic Design Ideas (Not Yet Implemented)

- **Roll Deception for Known Bullshit** — a potential mechanic variant where
  players can spend a resource to call a "known bluff" with a skill-check
  framing (D&D flavor). Noted for future rules exploration.

## NPC Roster (as of 2026-04-24)

| NPC | Status | Exclusives | Base Pulls |
|---|---|---|---|
| Walmart Karen | Active | 19 | 4 |

### Expansion Pack Roster (as of 2026-04-24)

| Pack | Status | Exclusive Cards | Dual-Listed |
|---|---|---|---|
| The Legend of Black Sparrow | Active | 9 | 4 |
| Jewels The Film Major | Active | 15 | 6 |

## NPC Backlog — Characters to Write

These characters are noted for future NPC development. No dialogue or cards
written yet — just reserved for when the roster expands.

| Character | Notes |
|---|---|
| Mega Church Pastor | Religious authority figure archetype |
| Chuck Wright (parody) | Local-legend / small-town notoriety angle |
| Ye (Kanye West) | Genius-messiah spiral archetype; rich card potential |
| Booty Warrior | Darkly comic institutional archetype |
| Donald Trump | Grievance-maximalism meets political collapse |
| JD Vance | Culture-war rags-to-riches-to-resentment arc |
| Jeffrey Epstein | High-level villainy; handle with intentionality |

## Known Gaps Across Both Prototypes

- onboarding-question-driven deck building not yet implemented
- no persistence, saved decks, or match history
- no online play, room system, or matchmaking
- no mobile polish pass
- no second NPC
