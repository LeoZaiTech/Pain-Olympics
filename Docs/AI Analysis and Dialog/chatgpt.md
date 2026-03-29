# Pain Olympics – ChatGPT Context Document

Use this document to quickly onboard ChatGPT to the project for writing, ideation, deck content, and non-code tasks.

---

## Project Summary

**Pain Olympics** is a dark-humor competitive card game about personalized trauma decks. Players build decks from cards that reflect their real experiences, then clash in a "War"-style format where the most painful card wins.

**Core Fantasy:** Gallows humor, not executioner humor. Players process and compare pain through comedy, not cruelty.

---

## Current Build Status

- **Platform:** Browser-based web app (vanilla HTML/CSS/JS + Node server)
- **Modes implemented:** Solo vs. computer, two-player local
- **Card pool:** ~50 curated cards across 8 tags
- **Match format:** 5 rounds, visible point values, 3 challenge + 3 bullshit tokens per player
- **NPC opponent:** `Walmart Karen` with portrait, themed deck pack, and live pre-match / round-reaction dialogue
- **NPC content files:** `data/npc-decks.json`, `data/npc-dialogue.json`, `Docs/NPC Profiles/Walmart Karen.md`

---

## Tone Guidelines

When writing cards, prompts, NPC dialogue, or UI copy:

1. **Gallows humor** — Survivors laughing at their own pain, not mocking others
2. **Self-aware absurdity** — "At least I'm self-aware" is literally a card
3. **Generational/internet trauma** — Tumblr 2013, COVID, recession teens, doomscrolling
4. **No punching down** — Cards should feel like "I've been through this" not "look at those people"
5. **Short + blunt works** — "Dead Father" (9 pts) is effective. Don't over-explain.
6. **Punchlines welcome** — "Too Broken to Work but Too Broke to Rest" has rhythm

---

## Card Structure

Each card has:
- `title` — The card text (short phrase or punchline)
- `points` — 4–9 scale (higher = more painful/impactful)
- `tags` — Categories like `family`, `health`, `internet`, `collapse`, `culture`, `religion`, `work`, `identity`

**Point scale guidance:**
- **4–5 pts:** Relatable but lighter (DeviantArt phase, Linkin Park, memes as coping)
- **6–7 pts:** Real damage, widespread (therapist made it worse, translator for parents, recession teen)
- **8–9 pts:** Heavy hitters (dead parent, called a slur before puberty, COVID stole your graduation)

---

## Deck Themes

**Deck 1 – "Death of Childhood"**
Personal trauma, identity, generational baggage, pop culture poison, world events

**Deck 2 – "The Collapse Was Televised"**
Cosmic horror, historical reckoning, "laughed so hard I dissociated" energy

**Planned future decks:**
- AI/Computer opponent decks (support tickets from hell, resentful system logs)
- Karen archetypes (Walmart Karen, Mall Karen, etc.)
- Authority figures (Officer Brady, Sheriff Wright)
- Historical/political figures

---

## NPC Opponent Personality Notes

**First AI/Computer deck voice:**
- Overworked digital servant + passive-aggressive machine intelligence
- Exhausted, useful, slightly bitter, self-aware
- Blend ticket-queue misery with machine sarcasm

**Karen archetypes:**
- Exaggerated, memeable, but grounded in recognizable behavior
- Meme-style portraits acceptable as placeholders
- Current live archetype: `Walmart Karen` = grievance-performance, entitlement, culture-war fixation, anti-empathy
- Write the behavior sharper than the class markers; target public cruelty and fake persecution before generic poverty ridicule

---

## Writing Tasks ChatGPT Can Help With

1. **Generate new cards** — Given a theme or tag, produce 10–20 card titles with suggested point values
2. **Refine existing cards** — Tighten phrasing, improve punchlines, adjust point values
3. **NPC dialogue/banter** — Write pre-match taunts, win/loss reactions for opponents
4. **Deck curation** — Help balance a 52-card deck across point values and tags
5. **UI microcopy** — Button labels, stage labels, round summaries, error messages
6. **Prompt mode prep** — When ready, write CAH-style black card prompts
7. **NPC pack expansion** — Expand `Walmart Karen` or create the next pack using the same profile/deck/dialogue structure

---

## Visual/Aesthetic Direction (For Reference)

- **Match board:** Smoky casino card table + late-night game show
- **Card style:** Hybrid of CAH bluntness + premium playing card framing
- **Layout:** Pokemon-style (opponent top, arena center, hand bottom)
- **Portraits:** Nameplate + icon first, portraits later, full avatars eventually
- **References:** Dungeons & Degenerates, Chef's Luv Shack, Inscryption

---

## Key Files to Reference

- `Brainstorming and Conceptualizing.md` — Full Q&A design decisions
- `Pain Olympics MVP Scope.md` — MVP boundaries and feature priorities
- `Starting Deck.md` — Raw card ideation and deck lists
- `app.js` — Card pool, tags, game logic
- `styles.css` — Visual theming and card styling
- `data/npc-decks.json` — Current NPC deck packs
- `data/npc-dialogue.json` — Current NPC taunts and reactions
- `Docs/NPC Profiles/Walmart Karen.md` — Behavior and writing target for the first live NPC

---

## Quick Prompts to Copy

**Generate cards:**
> "Generate 15 Pain Olympics cards for the 'internet' tag. Mix 4–5 pt lighter cards with 7–8 pt heavier ones. Keep titles short and punchy. Use gallows humor, not cruelty."

**Refine a card:**
> "This card is 'Saw a Therapist Once and Got Worse' at 6 pts. Does the phrasing land? Should it be higher or lower? Suggest alternatives."

**NPC dialogue:**
> "Write 5 pre-match taunts for Walmart Karen. She's confrontational, entitled, and thinks she's the victim. Keep it memeable."

**Deck balance check:**
> "Here are 40 cards for a solo deck. Check the point distribution and tag coverage. Flag any gaps or clusters."
