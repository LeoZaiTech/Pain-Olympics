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

- a main menu with `1 Player` and `2 Players`
- preserved 2-player `War` mode setup
- solo deck building by category or individual card selection
- solo auto-fill up to a 40-card player deck
- a computer rival with a 40-card random deck
- visible point values
- 3 `challenge` and 3 `bullshit` uses per player
- follow-up-card tiebreak flow
- round scoring and match scoring

Current prototype assumptions:

- 5 rounds
- 10-card starting hands for the current 2-player setup
- 40-card decks for solo mode
- same-browser simulation with a shared UI
- ties after the follow-up card become a stalemate
