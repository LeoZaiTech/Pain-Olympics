# Pain Olympics

Early concept and prototype work for a dark-humor card game about personalized trauma decks, visible point values, and social dispute mechanics.

## Files

- `Starting Deck.md`: raw deck ideation
- `Brainstorming and Conceptualizing.md`: documented Q and A about tone, rules, audience, and product direction
- `Pain Olympics MVP Scope.md`: rough MVP scope and staged product plan
- `index.html`, `styles.css`, `app.js`: first browser prototype for `War` mode

## Prototype

The current prototype is a minimal Node-powered web app with no external dependencies.

## Run It

From the project folder:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

You can also run:

```bash
npm run dev
```

Current prototype supports:

- 2-player `War` mode simulation
- tag-based hand generation
- visible point values
- 3 `challenge` and 3 `bullshit` uses per player
- follow-up-card tiebreak flow
- round scoring and match scoring

Current prototype assumptions:

- 5 rounds
- 10-card starting hands
- same-browser simulation
- ties after the follow-up card become a stalemate
