# Pain Olympics MVP Scope

## Product Goal

Build a portfolio-ready digital version of **Pain Olympics** that proves the core game loop is fun:

- personalized decks built from player experiences
- dark humor rooted in gallows humor, not cruelty
- strategic card play with visible point values
- social friction through `challenge` and `bullshit` mechanics

The MVP should be small enough to build and test, but strong enough to communicate the game's identity.

## Tone Pillars

- Gallows humor, not executioner humor
- Players decide what they are comfortable sharing
- Personalized and truth-adjacent play is the core fantasy
- Strategy and table drama matter as much as raw shock value

## Recommended MVP Definition

The **real MVP** should focus on one mode only:

- `War` mode

The MVP should be delivered as:

- a responsive web app that works on desktop and mobile browsers

The MVP should prioritize:

- proving the main loop
- showing deck personalization
- supporting private 1v1 play

The MVP should not try to solve everything at once.

## Core Gameplay Loop

1. Each player creates a deck through onboarding questions.
2. The game generates a personalized card pool for that player.
3. Each player enters a match with visible point values on their cards.
4. Both players secretly choose a card to play each round.
5. The stronger card wins by default.
6. The losing player may accept the result, or either player may spend a limited `challenge` or `bullshit` use.
7. If the dispute continues, both players play a follow-up card.
8. The tiebreak winner is decided by the combined point value of their two-card hand.
9. The round winner gains the value of all cards committed to that clash.
10. After a fixed number of rounds, the player with the highest score wins the match.

## Core Rules For MVP

- Match format: fixed-round match
- Recommended prototype default: 5 rounds
- Recommended release default: 7 rounds
- Hand privacy: only the owning player should see their hand
- Point values: visible on cards
- `Challenge` uses: 3 per player per match
- `Bullshit` uses: 3 per player per match
- Tiebreak rule: each player adds one follow-up card, then total values decide the winner
- Disclosure rule: players share only what they feel comfortable sharing

## In Scope For MVP

- Responsive browser-based UI
- Two-player `War` mode
- Player onboarding questionnaire
- Personalized starter deck generation
- Visible point values on cards
- Private hand view for each player
- Round resolution and scoring
- `Challenge` and `bullshit` counters
- Tiebreak follow-up card flow
- Match-end winner summary
- Curated starter card library

## Good Stretch Goals If Time Allows

- Solo mode with one authored NPC opponent
- Simple player profiles with saved deck preferences
- Match history screen
- Judge mode for a third participant
- Better deck editing after onboarding

## Explicitly Out Of Scope For The First MVP

- Full `Prompt` mode
- Public community card submissions
- Creator moderation dashboard
- Open online matchmaking with strangers
- Ranking systems or seasons
- Real-money monetization
- Physical card production workflows
- Native iOS or Android apps

## Why Matchmaking Is Not In The First MVP

The vision clearly points toward online matchmaking, but true public matchmaking adds several heavy problems all at once:

- moderation
- player reporting
- abuse prevention
- privacy handling
- account systems
- live networking complexity

That makes it a strong **post-MVP target**, not the first thing to ship.

## Sensible Build Staging

### Stage 1: Browser Prototype

- Local or single-browser simulation of the `War` loop
- Sample curated card pool
- Player tags or onboarding inputs
- Score, challenge, bullshit, and tiebreak flow

### Stage 2: MVP Release

- Responsive web app
- Private matches with invited players or room codes
- Personalized deck setup
- Match results and replayable sessions

### Stage 3: Expansion

- `Prompt` mode
- Solo tournament ladder with NPC opponents
- Public matchmaking
- Moderated player card submissions

## Suggested MVP Screens

- Landing screen
- Player onboarding / deck generation
- Match screen
- Round result / dispute flow
- Final score screen

## Early Data Model

### Card

- `id`
- `title`
- `points`
- `tags`
- `deck`
- `tone`
- `enabled`

### Player Match State

- `name`
- `score`
- `hand`
- `playedCards`
- `challengesLeft`
- `bullshitLeft`

### Match State

- `round`
- `maxRounds`
- `players`
- `status`
- `disputeType`
- `roundHistory`

## Content Structure Recommendation

The content system should support:

- short label cards
- longer punchline cards
- tags for onboarding and search
- optional deck grouping by theme or intensity

## Biggest Risks

- The humor lands as mean instead of cathartic
- Visible points overpower roleplay and social argument
- Public online play creates moderation problems too early
- Personalized trauma content feels invasive without strong privacy defaults

## Success Criteria

The MVP is successful if:

- players understand the rules quickly
- the game produces funny and tense round decisions
- players want to play more than one match
- the concept reads as a strong portfolio project
- the codebase is easy to expand into `Prompt` mode and solo NPC play

## Immediate Build Target

Based on the current documentation, the first thing to build is:

- a lightweight browser prototype for `War` mode using sample cards, visible scores, challenge counters, bullshit counters, and a follow-up-card tiebreak flow
