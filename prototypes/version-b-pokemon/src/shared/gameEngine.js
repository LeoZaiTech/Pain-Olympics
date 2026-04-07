import { CARD_POOL, SETTINGS } from './data.js';

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randomItem(arr) {
  if (!arr || !arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function cardById(id, extraCards = []) {
  if (!id) return null;
  return CARD_POOL.find(c => c.id === id) || extraCards.find(c => c.id === id) || null;
}

function uniqueCards(cards) {
  const seen = new Set();
  return cards.filter(c => {
    if (!c?.id || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

export function buildRandomDeck(size, excludedIds = []) {
  const ex = new Set(excludedIds);
  return shuffle(CARD_POOL.filter(c => !ex.has(c.id))).slice(0, size);
}

export function buildNpcDeck(npcKey, npcDecks) {
  const pack = npcDecks?.[npcKey];
  if (!pack) return buildRandomDeck(SETTINGS.soloDeckSize);
  const allCards = [...CARD_POOL, ...(pack.exclusiveCards || [])];
  const base = (pack.baseCardIds || []).map(id => allCards.find(c => c.id === id)).filter(Boolean);
  const excl = (pack.exclusiveCards || []).filter(c => c?.id && c?.title);
  const curated = uniqueCards([...base, ...excl]);
  const filler = buildRandomDeck(Math.max(SETTINGS.soloDeckSize - curated.length, 0), curated.map(c => c.id));
  return shuffle([...curated, ...filler]).slice(0, SETTINGS.soloDeckSize);
}

export function createFreshRoundState() {
  return {
    primarySelections: [null, null],
    followUpSelections: [null, null],
    disputeType: null,
    disputeBy: null,
    defaultWinnerIndex: null,
    winnerIndex: null,
    poolPoints: 0,
  };
}

export function createPlayer({ name, hand, isComputer = false, npcKey = '', portraitKey = '' }) {
  return {
    name,
    score: 0,
    hand,
    isComputer,
    npcKey,
    portraitKey,
    selectedCardId: null,
    followUpCardId: null,
    challengesLeft: SETTINGS.challengeUses,
    bullshitLeft: SETTINGS.bullshitUses,
  };
}

export function compareCards(a, b) {
  if (!a || !b) return null;
  if (a.points === b.points) return null;
  return a.points > b.points ? 0 : 1;
}

export function chooseComputerCard(player, cardType) {
  const excluded = new Set(cardType === 'followup' ? [player.selectedCardId] : []);
  const card = shuffle(player.hand.filter(c => !excluded.has(c.id)))[0];
  if (!card) return player;
  return { ...player, [cardType === 'primary' ? 'selectedCardId' : 'followUpCardId']: card.id };
}

export function lockIn(gs) {
  const allCards = [...CARD_POOL, ...gs.players.flatMap(p => p.hand),
    ...(gs.extraCards || [])];
  const primaries = gs.players.map(p => allCards.find(c => c.id === p.selectedCardId) || null);
  const defaultWinner = compareCards(primaries[0], primaries[1]);
  return {
    ...gs,
    phase: 'revealed',
    roundState: { ...gs.roundState, primarySelections: primaries, defaultWinnerIndex: defaultWinner },
  };
}

export function finalizeRound(gs, winnerIndex) {
  const { players, round, maxRounds, roundState } = gs;
  const allCommitted = [...roundState.primarySelections, ...roundState.followUpSelections].filter(Boolean);
  const pool = allCommitted.reduce((t, c) => t + (c?.points || 0), 0);
  const usedIds = new Set([
    ...players.map(p => p.selectedCardId),
    ...players.map(p => p.followUpCardId),
  ].filter(Boolean));
  const newPlayers = players.map((p, i) => ({
    ...p,
    score: p.score + (i === winnerIndex ? pool : 0),
    hand: p.hand.filter(c => !usedIds.has(c.id)),
    selectedCardId: null,
    followUpCardId: null,
  }));
  return {
    ...gs,
    players: newPlayers,
    phase: round >= maxRounds ? 'match-over' : 'resolved',
    roundState: { ...roundState, poolPoints: pool, winnerIndex },
  };
}

export function resolveTiebreak(gs) {
  const { players, roundState } = gs;
  const allCards = [...CARD_POOL, ...players.flatMap(p => p.hand), ...(gs.extraCards || [])];
  const followUps = players.map(p => allCards.find(c => c.id === p.followUpCardId) || null);
  const totals = [0, 1].map(i =>
    (roundState.primarySelections[i]?.points || 0) + (followUps[i]?.points || 0)
  );
  const winner = totals[0] === totals[1] ? null : (totals[0] > totals[1] ? 0 : 1);
  return finalizeRound({ ...gs, roundState: { ...roundState, followUpSelections: followUps } }, winner);
}

export function advanceRound(gs) {
  return { ...gs, round: gs.round + 1, phase: 'selecting', roundState: createFreshRoundState() };
}

export function pickNpcLine(dialogue, npcKey, lineType) {
  return randomItem(dialogue?.[npcKey]?.[lineType] || []);
}
