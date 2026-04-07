# AI Agent Setup for Pain Olympics

This document configures AI tools for automated and agent-assisted development of Pain Olympics.

## Quick Start

Copy-paste these into your AI tools to get started immediately.

### AGENTS.md (for Windsurf)

Create `AGENTS.md` in the project root:

```markdown
# AGENTS.md

## Read first

1. `README.md`
2. `progress.md`
3. `ARCHITECTURE.md`
4. `Docs/REACT_MIGRATION_PLAN.md`

## Operating rules

- Stay in one mode: `explore`, `decide`, `build`, `polish`, or `review`
- Treat repo files as source of truth over chat history
- Keep changes scoped to the current task
- Update `progress.md` after completing meaningful work

## Project context

- **Current state**: Vanilla HTML/CSS/JS prototype
- **Target state**: React + Vite (web), React Native (mobile)
- **Primary flow**: Solo deck-building card game with NPC opponents

## Key constraints

- Follow component mapping in `Docs/REACT_MIGRATION_PLAN.md`
- Use existing CSS variables from `styles.css`
- Keep business logic in `hooks/`, rendering in `components/`
- Match existing visual style before innovating

## Verification

After any change:
```bash
node --check app.js
node --check server.js
npm start  # verify at http://127.0.0.1:3000
```
```

### ChatGPT Custom Instructions

```text
I'm building Pain Olympics, a dark-humor card game.

When helping me:
- Reference project docs before suggesting solutions
- Use the exact handoff format for coding tools
- Focus on React migration and automation
- Keep NPC content in gallows humor tone, not cruel

Handoff format for Codex/Windsurf:
Mode:
Goal:
Source of truth:
Constraints:
Deliverable:
Verification:
Definition of done:
```

### Codex Kickoff

```text
Mode: build
Goal: [specific task]

Source of truth:
- README.md (current state)
- ARCHITECTURE.md (code structure)
- Docs/REACT_MIGRATION_PLAN.md (migration roadmap)

Constraints:
- Follow existing patterns
- Update progress.md when done
- Run verification checks

Deliverable:
- [specific files]

Verification:
- node --check [files]
- npm start works
- [specific test]

Definition of done:
- [acceptance criteria]
```

## Tool Assignments

| Task Type | Primary Tool | Backup |
|-----------|--------------|--------|
| React component creation | Codex | Windsurf |
| UI iteration and polish | Windsurf | - |
| State management design | ChatGPT | Claude |
| NPC content creation | ChatGPT | - |
| Test creation | Codex | - |
| Debugging | Windsurf | Codex |
| Architecture decisions | ChatGPT | Claude Code |
| Large refactoring | Claude Code | Codex |

## Automation Pipelines

### Pipeline 1: New NPC Creation

**Trigger**: Need a new opponent character

**Steps**:

1. **ChatGPT**: Generate NPC concept
   ```text
   Create a Pain Olympics NPC opponent.
   
   Required outputs:
   1. Name and archetype
   2. Visual direction (for portrait)
   3. Personality traits
   4. Card preferences (which tags they favor)
   
   Reference: Docs/NPC Profiles/Walmart Karen.md
   ```

2. **ChatGPT**: Generate deck
   ```text
   Create a 40-card deck for [NPC Name].
   
   Constraints:
   - Use cards from data.js CARD_POOL
   - Weight toward tags: [their preferred tags]
   - Include 5-8 high-point cards (7-10)
   - Include 10-15 medium cards (4-6)
   - Fill rest with low cards (1-3)
   
   Output as JSON for data/npc-decks.json
   ```

3. **ChatGPT**: Generate dialogue
   ```text
   Create dialogue for [NPC Name].
   
   Required:
   - 5 pre-match taunts
   - 3 win reactions
   - 3 loss reactions
   - 3 challenge responses
   - 3 bullshit call responses
   
   Tone: Match their personality, gallows humor
   Output as JSON for data/npc-dialogue.json
   ```

4. **Codex**: Integrate NPC
   ```text
   Mode: build
   Goal: Add [NPC Name] to the game
   
   Source of truth:
   - data/npc-decks.json (add deck)
   - data/npc-dialogue.json (add dialogue)
   - data.js SETTINGS.computerOpponents (add entry)
   
   Deliverable:
   - Updated JSON files
   - New NPC selectable in solo mode
   
   Verification:
   - npm start, select new NPC, play match
   - Dialogue appears in match log
   ```

### Pipeline 2: React Component Migration

**Trigger**: Need to port a render function to React

**Steps**:

1. **Analyze** (read first):
   - Current implementation in `app.js`
   - Component mapping in `Docs/REACT_MIGRATION_PLAN.md`
   - Related CSS in `styles.css`

2. **Codex**: Create component
   ```text
   Mode: build
   Goal: Port [renderFunction] to React component
   
   Source of truth:
   - app.js [function location]
   - Docs/REACT_MIGRATION_PLAN.md component mapping
   
   Constraints:
   - Functional component
   - Props documented with comments
   - No internal state (use context)
   - Import existing CSS classes
   
   Deliverable:
   - src/components/[path]/[Name].jsx
   
   Verification:
   - Component renders without errors
   - Visual output matches current prototype
   ```

3. **Windsurf**: Polish
   ```text
   Continue from Pain Olympics React migration.
   
   Goal: Polish [Component] to match prototype
   
   Read first:
   - src/components/[path]/[Name].jsx
   - styles.css for existing styles
   
   Tasks:
   - Fix any visual discrepancies
   - Verify mobile viewport
   - Add hover/active states if missing
   ```

### Pipeline 3: Card Content Creation

**Trigger**: Need new cards for a category

**Steps**:

1. **ChatGPT**: Generate cards
   ```text
   Generate 10 Pain Olympics cards for [TAG] category.
   
   Format:
   {
     id: "kebab-case-slug",
     title: "Display Title",
     points: 1-10,
     tags: ["primary-tag"]
   }
   
   Constraints:
   - Gallows humor, relatable
   - Points reflect specificity (more specific = more points)
   - Titles under 40 characters
   - No duplicate concepts with existing cards
   
   Reference existing cards in data.js CARD_POOL
   ```

2. **Codex**: Add to game
   ```text
   Mode: build
   Goal: Add new cards to CARD_POOL
   
   Source of truth:
   - data.js CARD_POOL section
   
   New cards:
   [paste ChatGPT output]
   
   Verification:
   - node --check data.js
   - Cards appear in solo deck builder
   - Cards can be selected and played
   ```

## Session Templates

### Starting Fresh Session

```text
I'm continuing work on Pain Olympics.

Read first:
- README.md (current state)
- progress.md (recent work)

Last session: [brief summary]
Today's goal: [specific task]
```

### Ending Session

Update `progress.md` with:
```markdown
## Recent Completed Work

- YYYY-MM-DD: [what was done]

## Recommended Next Work

- [next logical step]
```

### Handoff Between Tools

**ChatGPT → Codex**:
```text
ChatGPT helped me design [X].

Mode: build
Goal: Implement ChatGPT's recommendation
[include full handoff block]
```

**Codex → Windsurf**:
```text
Codex created [files].

Continue in Windsurf:
- Polish UI for [component]
- Verify mobile viewport
- Match existing visual style
```

**Windsurf → Codex**:
```text
Windsurf completed UI work on [component].

Mode: build
Goal: Add [logic/tests]
Recent changes: [files modified]
```

## Verification Checklist

After any coding session:

```bash
# Syntax check
node --check app.js
node --check server.js
node --check data.js

# Run server
npm start
# Open http://127.0.0.1:3000

# Manual checks
# [ ] Menu loads
# [ ] Solo setup works
# [ ] Can build deck
# [ ] Match plays through
# [ ] NPC dialogue appears
```

## File Ownership

| File/Folder | Primary Editor | Notes |
|-------------|----------------|-------|
| `data.js` | Human + ChatGPT | Card/NPC content |
| `data/*.json` | ChatGPT + Codex | NPC data |
| `app.js` | Codex | Game logic |
| `styles.css` | Windsurf | Visual styling |
| `index.html` | Codex | Structure only |
| `src/` | Codex + Windsurf | React components |
| `Docs/` | Human + ChatGPT | Documentation |

## React Native Preparation

When ready for mobile:

1. **ChatGPT**: Plan React Native architecture
   ```text
   I have a React web app for Pain Olympics.
   Plan the React Native migration.
   
   Current:
   - React + Vite web app
   - CSS styling
   - Browser-based
   
   Target:
   - React Native for iOS/Android
   - Shared game logic
   - Native styling
   
   Questions:
   1. What can be shared?
   2. What needs platform-specific versions?
   3. Recommended project structure?
   ```

2. **Codex**: Create shared modules
   ```text
   Mode: build
   Goal: Extract shared logic for React Native
   
   Move to shared/:
   - hooks/useGameState.js
   - utils/cardHelpers.js
   - utils/roundResolution.js
   - data/
   
   Keep platform-specific:
   - components/ (different for web vs native)
   - styles (CSS vs StyleSheet)
   ```

## Quick Reference

### Current File Structure
```
Pain Olympics/
├── index.html      # Static shell
├── app.js          # Game logic + rendering
├── data.js         # TAGS, CARD_POOL, SETTINGS
├── styles.css      # All styling
├── server.js       # Node HTTP server
├── data/
│   ├── npc-decks.json
│   └── npc-dialogue.json
└── Docs/
    ├── REACT_MIGRATION_PLAN.md
    ├── AI_AGENT_SETUP.md (this file)
    └── NPC Profiles/
```

### Target React Structure
```
src/
├── components/
│   ├── screens/
│   ├── match/
│   ├── cards/
│   └── ui/
├── hooks/
├── data/
├── utils/
├── App.jsx
└── main.jsx
```

### Key Commands
```bash
npm start           # Run current prototype
npm run dev         # (after React) Vite dev server
node --check app.js # Verify syntax
```
