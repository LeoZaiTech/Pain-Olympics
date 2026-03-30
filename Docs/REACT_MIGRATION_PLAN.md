# React + Vite Migration Plan

This document outlines the plan for migrating Pain Olympics from vanilla JS to
React + Vite. The migration should happen after the current board layout and
solo flow feel stable.

## Why Migrate?

| Current Pain Point | React Solution |
|--------------------|----------------|
| innerHTML string templates | JSX components with clear boundaries |
| Manual DOM queries (`elements` object) | Component refs only where needed |
| Global state object | React state/context with clear data flow |
| Full re-renders on any change | Virtual DOM diffing, targeted updates |
| AI agents confused by hybrid HTML | Component files are self-contained |

## Pre-Migration Checklist

Before starting the migration:

- [ ] Board layout is locked (no major structural changes pending)
- [ ] Card design is finalized
- [ ] Solo mode NPC flow is working
- [ ] Current prototype passes smoke tests
- [ ] All current features documented in progress.md

## Migration Phases

### Phase 1: Scaffolding (Day 1)

1. Initialize Vite + React project alongside existing files
2. Set up Tailwind CSS (or keep plain CSS initially)
3. Create basic folder structure
4. Move `data.js` to ES modules

```
src/
├── components/
│   ├── screens/
│   │   ├── MenuScreen.jsx
│   │   ├── SoloSetupScreen.jsx
│   │   ├── DuoSetupScreen.jsx
│   │   └── MatchScreen.jsx
│   ├── match/
│   │   ├── PlayerPanel.jsx
│   │   ├── OpponentPortrait.jsx
│   │   ├── Battlefield.jsx
│   │   ├── CommandTray.jsx
│   │   ├── HUD.jsx
│   │   └── MatchLog.jsx
│   ├── cards/
│   │   ├── Card.jsx
│   │   ├── HandCard.jsx
│   │   └── PlayedCard.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Pill.jsx
│       └── Panel.jsx
├── hooks/
│   ├── useGameState.js
│   ├── useNpcContent.js
│   └── useMatchFlow.js
├── data/
│   ├── tags.js
│   ├── cardPool.js
│   ├── settings.js
│   └── npcPaths.js
├── utils/
│   ├── cardHelpers.js
│   ├── playerFactory.js
│   └── roundResolution.js
├── App.jsx
└── main.jsx
```

### Phase 2: Core Components (Days 2-3)

Port in this order (simplest to most complex):

1. **UI primitives**: `Button`, `Pill`, `Panel`
2. **Card components**: `Card`, `HandCard`, `PlayedCard`
3. **Static screens**: `MenuScreen`
4. **Setup screens**: `SoloSetupScreen`, `DuoSetupScreen`
5. **Match components**: `HUD`, `MatchLog`, `CommandTray`
6. **Complex match components**: `PlayerPanel`, `OpponentPortrait`, `Battlefield`
7. **Root component**: `MatchScreen` → `App`

### Phase 3: State Management (Day 4)

Options (in order of complexity):

1. **useState + useContext** - Good for current scope
2. **useReducer + useContext** - Better for complex state transitions
3. **Zustand** - If state grows significantly
4. **Redux Toolkit** - Only if online multiplayer is added

Recommended: Start with `useReducer` + `useContext` since the game already has
clear state transitions (phases, rounds, selections).

```jsx
// Example: useGameState hook
const GameContext = createContext();

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_MATCH':
      return { ...state, screen: 'match', phase: 'selecting' };
    case 'LOCK_IN_CARDS':
      return { ...state, phase: 'revealed', roundState: { ... } };
    // etc.
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
```

### Phase 4: Styling (Day 5)

Options:

1. **Port existing CSS** - Copy `styles.css`, import in components
2. **CSS Modules** - Scope styles per component
3. **Tailwind CSS** - Utility-first, good for rapid iteration
4. **Styled Components** - CSS-in-JS if preferred

Recommended: Start by porting existing CSS, then incrementally adopt Tailwind
for new components.

### Phase 5: Polish & Testing (Days 6-7)

1. Add Framer Motion for card animations
2. Port Playwright tests to new structure
3. Mobile responsiveness pass
4. Performance audit

## Component Mapping

| Current Function | New Component |
|------------------|---------------|
| `renderPlayerPanel()` | `<PlayerPanel />` |
| `renderOpponentPortrait()` | `<OpponentPortrait />` |
| `renderPlayedCards()` | `<Battlefield />` |
| `renderRoundSummary()` | `<RoundSummary />` |
| `renderButtons()` | `<CommandTray />` |
| `renderLog()` | `<MatchLog />` |
| `renderStageText()` | `<HUD />` |
| `renderSoloBuilder()` | `<SoloSetupScreen />` |
| `buildCardMarkup()` | `<Card />` |

## Data Flow

```
App
 ├── GameProvider (state + dispatch)
 │    │
 │    ├── MenuScreen
 │    │
 │    ├── SoloSetupScreen
 │    │    └── CardLibrary
 │    │
 │    ├── DuoSetupScreen
 │    │    └── TagSelector
 │    │
 │    └── MatchScreen
 │         ├── HUD
 │         ├── OpponentPortrait
 │         ├── PlayerPanel (opponent)
 │         ├── Battlefield
 │         ├── PlayerPanel (player)
 │         ├── CommandTray
 │         └── MatchLog
```

## Vite Setup Commands

```bash
# Initialize new Vite project
npm create vite@latest pain-olympics-react -- --template react

# Or add to existing project
npm install vite @vitejs/plugin-react

# Dependencies
npm install react react-dom
npm install -D tailwindcss postcss autoprefixer  # Optional
npm install framer-motion  # Optional, for animations
```

## Preserving Current Work

During migration:

1. Keep `index.html`, `app.js`, `data.js`, `styles.css` in place
2. Build React app in `src/` folder
3. Run both in parallel for comparison
4. Switch over when React version is feature-complete
5. Archive vanilla files to `legacy/` folder

## Success Criteria

Migration is complete when:

- [ ] All current features work in React version
- [ ] Smoke tests pass
- [ ] No console errors
- [ ] Mobile layout works
- [ ] NPC dialogue integration works
- [ ] Card animations added
- [ ] Bundle size < 200KB gzipped

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Scaffolding | 1 day | None |
| Core Components | 2 days | Phase 1 |
| State Management | 1 day | Phase 2 |
| Styling | 1 day | Phase 3 |
| Polish & Testing | 2 days | Phase 4 |
| **Total** | **7 days** | |

## Decision Points

Before starting, decide:

1. **Tailwind vs plain CSS** - Tailwind speeds up iteration but adds learning curve
2. **TypeScript** - Adds type safety but more setup
3. **State library** - Start simple, upgrade if needed
4. **Animation library** - Framer Motion recommended

## Notes for AI Agents

When working on the React version:

- Each component should be self-contained
- Props should be clearly typed (or documented)
- Use the `data/` folder for all game content
- Keep business logic in `hooks/` and `utils/`
- Components should only handle rendering
