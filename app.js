/**
 * Pain Olympics - Application Logic
 *
 * Game state, rendering, and match flow.
 * Data constants (TAGS, CARD_POOL, SETTINGS) are loaded from data.js.
 */

const elements = {
  heroPanel: document.querySelector("#hero-panel"),
  menuScreen: document.querySelector("#menu-screen"),
  soloScreen: document.querySelector("#solo-screen"),
  duoScreen: document.querySelector("#two-player-screen"),
  openSoloModeBtn: document.querySelector("#open-solo-mode"),
  openDuoModeBtn: document.querySelector("#open-duo-mode"),
  backFromSoloBtn: document.querySelector("#back-from-solo"),
  backFromDuoBtn: document.querySelector("#back-from-duo"),
  setupForm: document.querySelector("#setup-form"),
  playerNameInputs: [
    document.querySelector("#player-0-name"),
    document.querySelector("#player-1-name"),
  ],
  duoTagContainers: [
    document.querySelector("#player-0-tags"),
    document.querySelector("#player-1-tags"),
  ],
  soloNameInput: document.querySelector("#solo-name"),
  soloTagGrid: document.querySelector("#solo-tag-grid"),
  soloSearch: document.querySelector("#solo-search"),
  soloCardLibrary: document.querySelector("#solo-card-library"),
  soloSelectedCards: document.querySelector("#solo-selected-cards"),
  soloDeckCounter: document.querySelector("#solo-deck-counter"),
  soloSelectionSummary: document.querySelector("#solo-selection-summary"),
  soloStartBtn: document.querySelector("#solo-start-btn"),
  soloAddCategoriesBtn: document.querySelector("#solo-add-categories"),
  soloRemoveCategoriesBtn: document.querySelector("#solo-remove-categories"),
  soloAutofillBtn: document.querySelector("#solo-autofill"),
  soloClearBtn: document.querySelector("#solo-clear"),
  hudPanel: document.querySelector("#hud-panel"),
  matchArea: document.querySelector("#match-area"),
  logPanel: document.querySelector("#log-panel"),
  roundLabel: document.querySelector("#round-label"),
  phasePill: document.querySelector("#phase-pill"),
  stageLabel: document.querySelector("#stage-label"),
  matchModeLabel: document.querySelector("#match-mode-label"),
  roundProgressFill: document.querySelector("#round-progress-fill"),
  opponentPortrait: document.querySelector("#opponent-portrait"),
  playerPanels: [
    document.querySelector("#player-0-panel"),
    document.querySelector("#player-1-panel"),
  ],
  playedLabels: [
    document.querySelector("#played-label-0"),
    document.querySelector("#played-label-1"),
  ],
  playedCardSlots: [
    document.querySelector("#played-card-0"),
    document.querySelector("#played-card-1"),
  ],
  lockInBtn: document.querySelector("#lock-in-btn"),
  resolveBtn: document.querySelector("#resolve-btn"),
  resolveTiebreakBtn: document.querySelector("#resolve-tiebreak-btn"),
  nextRoundBtn: document.querySelector("#next-round-btn"),
  resetBtn: document.querySelector("#reset-btn"),
  challengeBtns: [
    document.querySelector("#player-0-challenge-btn"),
    document.querySelector("#player-1-challenge-btn"),
  ],
  bullshitBtns: [
    document.querySelector("#player-0-bullshit-btn"),
    document.querySelector("#player-1-bullshit-btn"),
  ],
  roundSummary: document.querySelector("#round-summary"),
  matchLog: document.querySelector("#match-log"),
};

const state = {
  screen: "menu",
  mode: null,
  round: 1,
  maxRounds: SETTINGS.maxRounds,
  phase: "menu",
  players: [],
  roundState: createFreshRoundState(),
  log: [],
  npcContent: {
    decks: {},
    dialogue: {},
    status: "loading",
    error: null,
  },
  soloBuilder: {
    selectedCardIds: new Set(),
  },
};

function createFreshRoundState() {
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

function shuffle(array) {
  const copy = [...array];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function tagLabel(tagId) {
  return TAGS.find((tag) => tag.id === tagId)?.label ?? tagId;
}

function cardById(cardId) {
  if (!cardId) {
    return null;
  }

  const mainPoolCard = CARD_POOL.find((card) => card.id === cardId);
  if (mainPoolCard) {
    return mainPoolCard;
  }

  return (
    state.players
      .flatMap((player) => player.hand ?? [])
      .find((card) => card.id === cardId) ?? null
  );
}

function selectedTagsFromContainer(container) {
  return Array.from(container.querySelectorAll("input:checked")).map(
    (input) => input.value,
  );
}

function buildTagInputs() {
  elements.duoTagContainers.forEach((container, playerIndex) => {
    container.innerHTML = TAGS.map((tag) => {
      const isChecked =
        (playerIndex === 0 && ["family", "health", "internet"].includes(tag.id)) ||
        (playerIndex === 1 && ["culture", "collapse", "religion"].includes(tag.id));

      return `
        <label class="tag-option">
          <input type="checkbox" value="${tag.id}" ${isChecked ? "checked" : ""} />
          <span>${tag.label}</span>
        </label>
      `;
    }).join("");
  });

  elements.soloTagGrid.innerHTML = TAGS.map(
    (tag) => `
      <label class="tag-option">
        <input type="checkbox" value="${tag.id}" />
        <span>${tag.label}</span>
      </label>
    `,
  ).join("");
}

function buildRandomDeck(size, excludedIds = []) {
  const excludedSet = new Set(excludedIds);
  const availableCards = CARD_POOL.filter((card) => !excludedSet.has(card.id));
  return shuffle(availableCards).slice(0, size);
}

function randomItem(items = []) {
  if (!items.length) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

function uniqueCards(cards) {
  const seenCardIds = new Set();

  return cards.filter((card) => {
    if (!card?.id || seenCardIds.has(card.id)) {
      return false;
    }

    seenCardIds.add(card.id);
    return true;
  });
}

function getNpcDeckPack(npcKey) {
  return state.npcContent.decks[npcKey] ?? null;
}

function getNpcDialoguePack(npcKey) {
  return state.npcContent.dialogue[npcKey] ?? null;
}

function pickNpcLine(npcKey, lineType) {
  const dialoguePack = getNpcDialoguePack(npcKey);
  return randomItem(dialoguePack?.[lineType] ?? []);
}

function buildNpcDeck(npcKey) {
  const deckPack = getNpcDeckPack(npcKey);

  if (!deckPack) {
    return buildRandomDeck(SETTINGS.soloDeckSize);
  }

  const baseCards = (deckPack.baseCardIds ?? []).map(cardById).filter(Boolean);
  const exclusiveCards = (deckPack.exclusiveCards ?? []).filter(
    (card) => card?.id && card?.title,
  );
  const curatedCards = uniqueCards([...baseCards, ...exclusiveCards]);
  const fillerCards = buildRandomDeck(
    Math.max(SETTINGS.soloDeckSize - curatedCards.length, 0),
    curatedCards.map((card) => card.id),
  );

  return shuffle([...curatedCards, ...fillerCards]).slice(0, SETTINGS.soloDeckSize);
}

async function initializeNpcContent() {
  try {
    const [decksResponse, dialogueResponse] = await Promise.all([
      fetch(NPC_DATA_PATHS.decks),
      fetch(NPC_DATA_PATHS.dialogue),
    ]);

    if (!decksResponse.ok || !dialogueResponse.ok) {
      throw new Error("NPC content failed to load.");
    }

    const [decks, dialogue] = await Promise.all([
      decksResponse.json(),
      dialogueResponse.json(),
    ]);

    state.npcContent.decks = decks;
    state.npcContent.dialogue = dialogue;
    state.npcContent.status = "ready";
    state.npcContent.error = null;
  } catch (error) {
    console.error("Pain Olympics NPC content load failed.", error);
    state.npcContent.status = "error";
    state.npcContent.error = error;
  } finally {
    render();
  }
}

function buildHandFromTags(selectedTags, size) {
  if (!selectedTags.length) {
    return buildRandomDeck(size);
  }

  const matchingCards = CARD_POOL.filter((card) =>
    selectedTags.some((tag) => card.tags.includes(tag)),
  );
  const fallbackCards = CARD_POOL.filter(
    (card) => !matchingCards.some((match) => match.id === card.id),
  );

  return shuffle([...matchingCards, ...fallbackCards]).slice(0, size);
}

function selectedSoloTags() {
  return selectedTagsFromContainer(elements.soloTagGrid);
}

function toggleSoloCardSelection(cardId) {
  const selectedIds = state.soloBuilder.selectedCardIds;

  if (selectedIds.has(cardId)) {
    selectedIds.delete(cardId);
  } else if (selectedIds.size < SETTINGS.soloDeckSize) {
    selectedIds.add(cardId);
  }

  render();
}

function addSoloCardsByTags() {
  const selectedIds = state.soloBuilder.selectedCardIds;
  const tags = selectedSoloTags();

  if (!tags.length) {
    return;
  }

  CARD_POOL.filter((card) => tags.some((tag) => card.tags.includes(tag))).forEach((card) => {
    if (selectedIds.size < SETTINGS.soloDeckSize) {
      selectedIds.add(card.id);
    }
  });

  render();
}

function removeSoloCardsByTags() {
  const tags = selectedSoloTags();

  if (!tags.length) {
    return;
  }

  Array.from(state.soloBuilder.selectedCardIds).forEach((cardId) => {
    const card = cardById(cardId);
    if (card && tags.some((tag) => card.tags.includes(tag))) {
      state.soloBuilder.selectedCardIds.delete(cardId);
    }
  });

  render();
}

function autoFillSoloDeck() {
  const selectedIds = Array.from(state.soloBuilder.selectedCardIds);
  const cardsToAdd = buildRandomDeck(
    SETTINGS.soloDeckSize - selectedIds.length,
    selectedIds,
  );

  cardsToAdd.forEach((card) => {
    state.soloBuilder.selectedCardIds.add(card.id);
  });

  render();
}

function clearSoloDeck() {
  state.soloBuilder.selectedCardIds.clear();
  render();
}

function createPlayer({
  name,
  tags = [],
  hand = [],
  isComputer = false,
  handVisible = false,
  subtitle = "",
  portraitSrc = "",
  portraitAlt = "",
  npcKey = "",
}) {
  return {
    name,
    tags,
    score: 0,
    hand,
    isComputer,
    handVisible,
    subtitle,
    portraitSrc,
    portraitAlt,
    npcKey,
    selectedCardId: null,
    followUpCardId: null,
    challengesLeft: SETTINGS.challengeUses,
    bullshitLeft: SETTINGS.bullshitUses,
  };
}

function createDuoPlayer(playerIndex) {
  const name = elements.playerNameInputs[playerIndex].value.trim() || `Player ${playerIndex + 1}`;
  const tags = selectedTagsFromContainer(elements.duoTagContainers[playerIndex]);

  return createPlayer({
    name,
    tags,
    hand: buildHandFromTags(tags, SETTINGS.duoHandSize),
    handVisible: false,
  });
}

function createSoloHumanPlayer() {
  const selectedIds = Array.from(state.soloBuilder.selectedCardIds);
  const selectedCards = selectedIds.map(cardById).filter(Boolean);
  const cardsToAdd = buildRandomDeck(
    Math.max(SETTINGS.soloDeckSize - selectedCards.length, 0),
    selectedIds,
  );

  return createPlayer({
    name: elements.soloNameInput.value.trim() || "Player One",
    tags: selectedSoloTags(),
    hand: [...selectedCards, ...cardsToAdd],
    handVisible: true,
  });
}

function createComputerPlayer() {
  const npcKey = SETTINGS.defaultComputerOpponentKey;
  const deckPack = getNpcDeckPack(npcKey);
  const computerProfile = SETTINGS.computerOpponents[0];
  const resolvedName = deckPack?.name ?? computerProfile.name;
  const resolvedSubtitle = deckPack?.subtitle ?? computerProfile.subtitle;
  const resolvedPortraitSrc = deckPack?.portraitSrc ?? computerProfile.portraitSrc;
  const resolvedPortraitAlt =
    deckPack?.portraitAlt ?? computerProfile.portraitAlt ?? `${resolvedName} portrait`;

  return createPlayer({
    name: resolvedName,
    tags: ["npc-deck", npcKey],
    hand: buildNpcDeck(npcKey),
    isComputer: true,
    handVisible: false,
    subtitle: resolvedSubtitle,
    portraitSrc: resolvedPortraitSrc,
    portraitAlt: resolvedPortraitAlt,
    npcKey,
  });
}

function startMatch(mode, players) {
  state.screen = "match";
  state.mode = mode;
  state.round = 1;
  state.maxRounds = SETTINGS.maxRounds;
  state.phase = "selecting";
  state.players = players;
  state.roundState = createFreshRoundState();
  state.log = [];

  addLogEntry(
    mode === "solo"
      ? `${players[0].name} enters the arena against ${players[1].name}.`
      : "Two-player match generated. Both players can reveal their own hands and choose a primary card.",
  );

  if (mode === "solo") {
    const preTaunt = pickNpcLine(players[1].npcKey, "preTaunts");
    if (preTaunt) {
      addLogEntry(`${players[1].name}: "${preTaunt}"`);
    }
  }

  render();
}

function buildDuoMatch(event) {
  event.preventDefault();
  startMatch("duo", [createDuoPlayer(0), createDuoPlayer(1)]);
}

function buildSoloMatch() {
  if (!state.soloBuilder.selectedCardIds.size) {
    return;
  }

  startMatch("solo", [createSoloHumanPlayer(), createComputerPlayer()]);
}

function chooseComputerCard(cardType) {
  const computer = state.players[1];

  if (!computer?.isComputer) {
    return;
  }

  const excludedIds =
    cardType === "followup" ? [computer.selectedCardId].filter(Boolean) : [];
  const card = shuffle(
    computer.hand.filter((handCard) => !excludedIds.includes(handCard.id)),
  )[0];

  if (!card) {
    return;
  }

  if (cardType === "primary") {
    computer.selectedCardId = card.id;
  } else {
    computer.followUpCardId = card.id;
  }
}

function handleCardClick(playerIndex, cardId) {
  const player = state.players[playerIndex];

  if (!player || player.isComputer) {
    return;
  }

  if (state.phase === "selecting") {
    player.selectedCardId = cardId;
  } else if (state.phase === "tiebreak-selecting") {
    player.followUpCardId = cardId;
  }

  render();
}

function toggleHandVisibility(playerIndex) {
  const player = state.players[playerIndex];

  if (!player || player.isComputer || state.mode !== "duo") {
    return;
  }

  player.handVisible = !player.handVisible;
  render();
}

function compareCards(firstCard, secondCard) {
  if (!firstCard || !secondCard) {
    return null;
  }

  if (firstCard.points === secondCard.points) {
    return null;
  }

  return firstCard.points > secondCard.points ? 0 : 1;
}

function lockInPrimaryCards() {
  if (state.mode === "solo") {
    if (!state.players[0]?.selectedCardId) {
      return;
    }

    chooseComputerCard("primary");
    addLogEntry(`${state.players[1].name} locks in a face-down card.`);
  } else if (!state.players.every((player) => player.selectedCardId)) {
    return;
  }

  state.roundState.primarySelections = state.players.map((player) =>
    cardById(player.selectedCardId),
  );
  state.roundState.defaultWinnerIndex = compareCards(
    state.roundState.primarySelections[0],
    state.roundState.primarySelections[1],
  );
  state.phase = "revealed";

  if (state.roundState.defaultWinnerIndex === null) {
    addLogEntry("Primary cards tied. Follow-up cards are now required.");
  } else {
    addLogEntry(
      `${state.players[state.roundState.defaultWinnerIndex].name} leads the round by default.`,
    );
  }

  render();
}

function enterTiebreak(message) {
  state.phase = "tiebreak-selecting";
  state.players.forEach((player) => {
    player.followUpCardId = null;
  });

  if (message) {
    addLogEntry(message);
  }

  if (state.mode === "solo") {
    chooseComputerCard("followup");
    addLogEntry(`${state.players[1].name} throws in a follow-up card.`);
  }

  render();
}

function beginDispute(disputeType, playerIndex) {
  if (state.phase !== "revealed") {
    return;
  }

  const player = state.players[playerIndex];

  if (!player || player.isComputer) {
    return;
  }

  if (disputeType === "challenge" && player.challengesLeft <= 0) {
    return;
  }

  if (disputeType === "bullshit" && player.bullshitLeft <= 0) {
    return;
  }

  if (disputeType === "challenge") {
    player.challengesLeft -= 1;
  } else {
    player.bullshitLeft -= 1;
  }

  state.roundState.disputeType = disputeType;
  state.roundState.disputeBy = playerIndex;

  enterTiebreak(`${player.name} spent a ${disputeType} token.`);
}

function resolveRound() {
  if (state.phase !== "revealed") {
    return;
  }

  if (state.roundState.defaultWinnerIndex === null) {
    enterTiebreak("No default winner. Proceeding to follow-up cards.");
    return;
  }

  finalizeRound(state.roundState.defaultWinnerIndex);
}

function resolveTiebreak() {
  const needsHumanCard = Boolean(state.players[0]?.followUpCardId);
  const needsSecondCard =
    state.mode === "duo"
      ? Boolean(state.players[1]?.followUpCardId)
      : Boolean(state.players[1]?.followUpCardId);

  if (state.phase !== "tiebreak-selecting" || !needsHumanCard || !needsSecondCard) {
    return;
  }

  state.roundState.followUpSelections = state.players.map((player) =>
    cardById(player.followUpCardId),
  );

  const firstTotal =
    state.roundState.primarySelections[0].points +
    state.roundState.followUpSelections[0].points;
  const secondTotal =
    state.roundState.primarySelections[1].points +
    state.roundState.followUpSelections[1].points;

  if (firstTotal === secondTotal) {
    finalizeRound(null);
    return;
  }

  finalizeRound(firstTotal > secondTotal ? 0 : 1);
}

function finalizeRound(winnerIndex) {
  const usedCardIds = [];
  const primaryCards = state.roundState.primarySelections;
  const followUpCards = state.roundState.followUpSelections.filter(Boolean);
  const poolPoints = [...primaryCards, ...followUpCards].reduce(
    (total, card) => total + (card?.points ?? 0),
    0,
  );

  state.roundState.poolPoints = poolPoints;
  state.roundState.winnerIndex = winnerIndex;

  state.players.forEach((player) => {
    if (player.selectedCardId) {
      usedCardIds.push(player.selectedCardId);
    }
    if (player.followUpCardId) {
      usedCardIds.push(player.followUpCardId);
    }
  });

  if (winnerIndex !== null) {
    state.players[winnerIndex].score += poolPoints;
    addLogEntry(
      `${state.players[winnerIndex].name} takes ${poolPoints} points from the clash.`,
    );

    if (state.mode === "solo") {
      const computerPlayer = state.players[1];
      const lineType = winnerIndex === 1 ? "winLines" : "lossLines";
      const reactionLine = pickNpcLine(computerPlayer?.npcKey, lineType);

      if (reactionLine) {
        addLogEntry(`${computerPlayer.name}: "${reactionLine}"`);
      }
    }
  } else {
    addLogEntry("The tiebreak ended in a stalemate. No one takes points this round.");
  }

  state.players.forEach((player) => {
    player.hand = player.hand.filter((card) => !usedCardIds.includes(card.id));
    player.selectedCardId = null;
    player.followUpCardId = null;
  });

  state.phase = state.round >= state.maxRounds ? "match-over" : "resolved";

  if (state.phase === "match-over") {
    addLogEntry(buildMatchOverMessage());
  }

  render();
}

function buildMatchOverMessage() {
  const [firstPlayer, secondPlayer] = state.players;

  if (firstPlayer.score === secondPlayer.score) {
    return `Match over. ${firstPlayer.name} and ${secondPlayer.name} are dead even at ${firstPlayer.score} points.`;
  }

  const winner = firstPlayer.score > secondPlayer.score ? firstPlayer : secondPlayer;
  const loser = winner === firstPlayer ? secondPlayer : firstPlayer;
  return `Match over. ${winner.name} wins ${winner.score} to ${loser.score}.`;
}

function advanceRound() {
  if (state.phase !== "resolved") {
    return;
  }

  state.round += 1;
  state.phase = "selecting";
  state.roundState = createFreshRoundState();
  addLogEntry(`Round ${state.round} begins. Choose primary cards.`);
  render();
}

function clearMatchState() {
  state.mode = null;
  state.round = 1;
  state.maxRounds = SETTINGS.maxRounds;
  state.phase = "menu";
  state.players = [];
  state.roundState = createFreshRoundState();
  state.log = [];
}

function resetMatchToMenu() {
  clearMatchState();
  state.screen = "menu";
  render();
}

function addLogEntry(message) {
  state.log.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
  });
}

function buildCardMarkup(card) {
  const primaryTag = tagLabel(card.tags[0] ?? "misc");

  return `
    <div class="card-frame">
      <div class="card-topline">
        <div class="card-corner">
          <span class="corner-value">${card.points}</span>
          <span class="corner-label">PTS</span>
        </div>
        <div class="card-banner">${primaryTag}</div>
        <div class="card-corner is-flipped">
          <span class="corner-value">${card.points}</span>
          <span class="corner-label">PTS</span>
        </div>
      </div>

      <div class="card-body">
        <div class="card-title">${card.title}</div>
      </div>

      <div class="card-bottomline">
        <div class="card-tags">
          ${card.tags
            .map((tag) => `<span class="player-tag">${tagLabel(tag)}</span>`)
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderSoloBuilder() {
  const searchTerm = elements.soloSearch.value.trim().toLowerCase();
  const selectedIds = state.soloBuilder.selectedCardIds;
  const selectedCards = CARD_POOL.filter((card) => selectedIds.has(card.id));
  const filteredCards = CARD_POOL.filter((card) => {
    if (!searchTerm) {
      return true;
    }

    const haystack = `${card.title} ${card.tags.join(" ")}`.toLowerCase();
    return haystack.includes(searchTerm);
  });

  elements.soloDeckCounter.textContent = `${selectedIds.size} / ${SETTINGS.soloDeckSize} selected`;
  let selectionSummary =
    selectedIds.size === 0
      ? "Pick individual cards, bulk-add them by category, or mix both approaches."
      : selectedIds.size < SETTINGS.soloDeckSize
        ? `You have ${selectedIds.size} cards selected. Starting a match will auto-fill the remaining ${
            SETTINGS.soloDeckSize - selectedIds.size
          } slots with random cards.`
        : "Your 40-card solo deck is full and ready to go.";

  if (state.npcContent.status === "loading") {
    selectionSummary = `${selectionSummary} Loading Walmart Karen's themed deck and dialogue pack.`;
  } else if (state.npcContent.status === "error") {
    selectionSummary = `${selectionSummary} NPC content failed to load, so solo mode will fall back to the default prototype opponent.`;
  }

  elements.soloSelectionSummary.textContent = selectionSummary;
  elements.soloStartBtn.disabled =
    selectedIds.size === 0 || state.npcContent.status === "loading";

  elements.soloCardLibrary.innerHTML = filteredCards.length
    ? filteredCards
        .map((card) => {
          const isSelected = selectedIds.has(card.id);
          const isDisabled = !isSelected && selectedIds.size >= SETTINGS.soloDeckSize;

          return `
            <button
              class="library-card ${isSelected ? "is-selected" : ""}"
              type="button"
              data-card-id="${card.id}"
              ${isDisabled ? "disabled" : ""}
            >
              ${buildCardMarkup(card)}
              <div class="selection-note">${isSelected ? "Selected" : "Click to add"}</div>
            </button>
          `;
        })
        .join("")
    : `<div class="meta-card"><span class="meta-line">No cards match that search.</span></div>`;

  elements.soloCardLibrary.querySelectorAll(".library-card").forEach((button) => {
    button.addEventListener("click", () => toggleSoloCardSelection(button.dataset.cardId));
  });

  const orderedSelectedCards = [...selectedCards].sort((firstCard, secondCard) => {
    if (secondCard.points !== firstCard.points) {
      return secondCard.points - firstCard.points;
    }

    return firstCard.title.localeCompare(secondCard.title);
  });

  elements.soloSelectedCards.innerHTML = orderedSelectedCards.length
    ? orderedSelectedCards
        .map(
          (card) => `
            <button
              class="selected-card-item"
              type="button"
              data-remove-card-id="${card.id}"
            >
              <div class="selection-line">
                <strong>${card.title}</strong>
                <span class="card-points">${card.points} pts</span>
              </div>
              <div class="card-tags">
                ${card.tags
                  .map((tag) => `<span class="player-tag">${tagLabel(tag)}</span>`)
                  .join("")}
              </div>
              <div class="selection-note">Click to remove</div>
            </button>
          `,
        )
        .join("")
    : `<div class="meta-card"><span class="meta-line">No cards selected yet.</span></div>`;

  elements.soloSelectedCards
    .querySelectorAll("[data-remove-card-id]")
    .forEach((button) => {
      button.addEventListener("click", () =>
        toggleSoloCardSelection(button.dataset.removeCardId),
      );
    });
}

function renderPlayerPanel(playerIndex) {
  const player = state.players[playerIndex];

  if (!player) {
    elements.playerPanels[playerIndex].innerHTML = "";
    return;
  }

  const isSelectingPrimary = state.phase === "selecting";
  const isSelectingFollowUp = state.phase === "tiebreak-selecting";
  const currentSelectionId = isSelectingPrimary
    ? player.selectedCardId
    : player.followUpCardId;
  const primaryCardId = player.selectedCardId;
  const isComputer = player.isComputer;
  const handVisible = state.mode === "solo" ? !isComputer : player.handVisible;
  const handNote = isComputer
    ? "Computer deck stays hidden in this prototype."
    : "Hand hidden. Reveal only when it is your turn to choose.";

  const handMarkup = handVisible
    ? player.hand
        .map((card, cardIndex) => {
          const isDisabled =
            isComputer ||
            (!isSelectingPrimary && !isSelectingFollowUp) ||
            (isSelectingFollowUp && card.id === primaryCardId);
          const isSelected = currentSelectionId === card.id;
          const fanOffset = cardIndex - (player.hand.length - 1) / 2;

          return `
            <button
              class="hand-card ${isSelected ? "is-selected" : ""}"
              type="button"
              data-player-index="${playerIndex}"
              data-card-id="${card.id}"
              style="--fan-offset:${fanOffset};"
              ${isDisabled ? "disabled" : ""}
            >
              ${buildCardMarkup(card)}
            </button>
          `;
        })
        .join("")
    : `<div class="meta-line">${handNote}</div>`;

  elements.playerPanels[playerIndex].innerHTML = `
    <div class="player-header">
      <div>
        <div class="mini-pill">${playerIndex === 0 ? "Your Side" : "Opponent"}</div>
        <p class="player-name">${player.name}</p>
        <p class="meta-line">${
          isComputer
            ? player.subtitle || "40-card random computer deck"
            : `Tags: ${player.tags.map(tagLabel).join(", ") || "Open pool"}`
        }</p>
      </div>
      ${
        state.mode === "duo" && !isComputer
          ? `
            <button class="ghost-button toggle-hand-button" type="button" data-player-index="${playerIndex}">
              ${player.handVisible ? "Hide Hand" : "Reveal Hand"}
            </button>
          `
          : `<div class="mini-pill">${
              isComputer ? "Concealed hand" : "Solo hand visible"
            }</div>`
      }
    </div>

    <div class="player-meta">
      <div class="meta-card">
        <span class="meta-line">Score</span>
        <span class="meta-value">${player.score}</span>
      </div>
      <div class="meta-card">
        <span class="meta-line">Cards Left</span>
        <span class="meta-value">${player.hand.length}</span>
      </div>
      <div class="meta-card">
        <span class="meta-line">Challenges</span>
        <span class="meta-value">${player.challengesLeft}</span>
      </div>
      <div class="meta-card">
        <span class="meta-line">Bullshit</span>
        <span class="meta-value">${player.bullshitLeft}</span>
      </div>
    </div>

    <div class="meta-card">
      <span class="meta-line">Current pick</span>
      <span class="meta-value">
        ${
          currentSelectionId
            ? cardById(currentSelectionId)?.title
            : isSelectingFollowUp
              ? "No follow-up locked in"
              : "No primary card locked in"
        }
      </span>
    </div>

    <div class="hand-grid">${handMarkup}</div>
  `;

  const toggleButton = elements.playerPanels[playerIndex].querySelector(".toggle-hand-button");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => toggleHandVisibility(playerIndex));
  }

  elements.playerPanels[playerIndex].querySelectorAll(".hand-card").forEach((button) => {
    button.addEventListener("click", () =>
      handleCardClick(Number(button.dataset.playerIndex), button.dataset.cardId),
    );
  });
}

function renderOpponentPortrait() {
  const opponent = state.players[1];

  if (!opponent) {
    elements.opponentPortrait.innerHTML = `
      <div class="portrait-header">
        <p class="eyebrow">Opponent Spotlight</p>
        <div class="mini-pill">Prototype portrait</div>
      </div>
      <div class="portrait-frame portrait-frame-placeholder">
        <div class="portrait-placeholder">
          <span class="placeholder-kicker">Awaiting Rival</span>
          <strong class="placeholder-name">No opponent loaded</strong>
        </div>
      </div>
    `;
    return;
  }

  if (opponent.portraitSrc) {
    elements.opponentPortrait.innerHTML = `
      <div class="portrait-header">
        <p class="eyebrow">Opponent Spotlight</p>
        <div class="mini-pill">Featured rival</div>
      </div>
      <div class="portrait-frame">
        <img src="${opponent.portraitSrc}" alt="${opponent.portraitAlt || opponent.name}" />
      </div>
      <div>
        <div class="portrait-caption">Current opponent</div>
        <div class="portrait-name">${opponent.name}</div>
      </div>
    `;
    return;
  }

  const initials = opponent.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  elements.opponentPortrait.innerHTML = `
    <div class="portrait-header">
      <p class="eyebrow">Opponent Spotlight</p>
      <div class="mini-pill">Identity panel</div>
    </div>
    <div class="portrait-frame portrait-frame-placeholder">
      <div class="portrait-placeholder">
        <span class="placeholder-kicker">${opponent.subtitle || "Computer rival"}</span>
        <strong class="placeholder-name">${initials}</strong>
      </div>
    </div>
    <div>
      <div class="portrait-caption">Current opponent</div>
      <div class="portrait-name">${opponent.name}</div>
    </div>
  `;
}

function renderPlayedCards() {
  [0, 1].forEach((playerIndex) => {
    const primaryCard = state.roundState.primarySelections[playerIndex];
    const followUpCard = state.roundState.followUpSelections[playerIndex];
    const slot = elements.playedCardSlots[playerIndex];

    elements.playedLabels[playerIndex].textContent =
      state.players[playerIndex]?.name ?? `Player ${playerIndex + 1}`;

    if (!primaryCard) {
      slot.className = "played-card empty-slot";
      slot.textContent = "No card locked in";
      return;
    }

    slot.className = "played-card";
    slot.innerHTML = `
      <div class="mini-pill">Primary</div>
      ${buildCardMarkup(primaryCard)}
      ${
        followUpCard
          ? `
            <div class="mini-pill">Follow-up</div>
            ${buildCardMarkup(followUpCard)}
          `
          : ""
      }
    `;
  });
}

function renderRoundSummary() {
  if (!state.players.length) {
    elements.roundSummary.textContent = "Choose a mode to start playing.";
    return;
  }

  if (state.phase === "selecting") {
    elements.roundSummary.textContent =
      state.mode === "solo"
        ? "Choose your primary card. The computer will lock in a random card when you confirm."
        : "Both players choose a primary card. Lock them in once both selections are ready.";
    return;
  }

  if (state.phase === "revealed") {
    if (state.roundState.defaultWinnerIndex === null) {
      elements.roundSummary.textContent =
        "Primary card values are tied. Resolve the tiebreak to continue.";
      return;
    }

    const leader = state.players[state.roundState.defaultWinnerIndex];
    const trailingIndex = state.roundState.defaultWinnerIndex === 0 ? 1 : 0;
    const leaderPoints =
      state.roundState.primarySelections[state.roundState.defaultWinnerIndex].points;
    const trailingPoints = state.roundState.primarySelections[trailingIndex].points;

    elements.roundSummary.textContent = `${leader.name} is ahead by default with ${leaderPoints} points against ${trailingPoints}. Accept the result or spend a dispute token.`;
    return;
  }

  if (state.phase === "tiebreak-selecting") {
    elements.roundSummary.textContent =
      state.mode === "solo"
        ? "Choose your follow-up card. The computer has already thrown one into the pile."
        : "Each player must choose one follow-up card. The combined total decides the clash.";
    return;
  }

  if (state.phase === "resolved" || state.phase === "match-over") {
    if (state.roundState.winnerIndex === null) {
      elements.roundSummary.textContent =
        "The round ended in a stalemate. No one claimed the points in the pool.";
      return;
    }

    const firstTotal =
      state.roundState.primarySelections[0].points +
      (state.roundState.followUpSelections[0]?.points ?? 0);
    const secondTotal =
      state.roundState.primarySelections[1].points +
      (state.roundState.followUpSelections[1]?.points ?? 0);

    elements.roundSummary.textContent = `${state.players[state.roundState.winnerIndex].name} wins the clash ${firstTotal} to ${secondTotal} and captures ${state.roundState.poolPoints} points.`;
  }
}

function renderButtons() {
  const hasPlayers = state.players.length === 2;
  const humanPrimaryReady = Boolean(state.players[0]?.selectedCardId);
  const bothPrimaryReady = state.players.every((player) => player.selectedCardId);
  const humanFollowUpReady = Boolean(state.players[0]?.followUpCardId);
  const bothFollowUpsReady = state.players.every((player) => player.followUpCardId);

  elements.lockInBtn.textContent =
    state.mode === "solo" ? "Lock In Player Card" : "Lock In Primary Cards";
  elements.lockInBtn.disabled = !(
    hasPlayers &&
    state.phase === "selecting" &&
    (state.mode === "solo" ? humanPrimaryReady : bothPrimaryReady)
  );
  elements.resolveBtn.disabled = !(hasPlayers && state.phase === "revealed");
  elements.resolveTiebreakBtn.disabled = !(
    hasPlayers &&
    state.phase === "tiebreak-selecting" &&
    (state.mode === "solo" ? humanFollowUpReady && Boolean(state.players[1]?.followUpCardId) : bothFollowUpsReady)
  );
  elements.nextRoundBtn.disabled = !(hasPlayers && state.phase === "resolved");

  state.players.forEach((player, playerIndex) => {
    elements.challengeBtns[playerIndex].textContent = `${player.name} Challenge`;
    elements.bullshitBtns[playerIndex].textContent = `${player.name} Bullshit`;
  });

  if (!hasPlayers) {
    elements.challengeBtns.forEach((button) => {
      button.disabled = true;
      button.classList.remove("hidden");
    });
    elements.bullshitBtns.forEach((button) => {
      button.disabled = true;
      button.classList.remove("hidden");
    });
    return;
  }

  if (state.mode === "solo") {
    elements.challengeBtns[1].classList.add("hidden");
    elements.bullshitBtns[1].classList.add("hidden");
    elements.challengeBtns[0].classList.remove("hidden");
    elements.bullshitBtns[0].classList.remove("hidden");
    elements.challengeBtns[0].disabled =
      state.phase !== "revealed" || state.players[0].challengesLeft <= 0;
    elements.bullshitBtns[0].disabled =
      state.phase !== "revealed" || state.players[0].bullshitLeft <= 0;
  } else {
    elements.challengeBtns.forEach((button, playerIndex) => {
      button.classList.remove("hidden");
      button.disabled =
        state.phase !== "revealed" || state.players[playerIndex].challengesLeft <= 0;
    });
    elements.bullshitBtns.forEach((button, playerIndex) => {
      button.classList.remove("hidden");
      button.disabled =
        state.phase !== "revealed" || state.players[playerIndex].bullshitLeft <= 0;
    });
  }
}

function renderLog() {
  elements.matchLog.innerHTML = state.log
    .map((entry) => `<li class="log-entry">${entry.message}</li>`)
    .join("");
}

function renderStageText() {
  const stageMap = {
    menu: {
      label: "Standby",
      copy: "Choose a mode to begin.",
    },
    selecting: {
      label: "Hidden Pick",
      copy: "Lock in primary cards before the reveal.",
    },
    revealed: {
      label: "Reveal",
      copy: "Default outcome is live. Accept it or trigger a dispute.",
    },
    "tiebreak-selecting": {
      label: "Tiebreak",
      copy: "Follow-up cards are now required.",
    },
    resolved: {
      label: "Resolved",
      copy: "Round complete. Advance when ready.",
    },
    "match-over": {
      label: "Final",
      copy: "Match complete. Return to menu for a new run.",
    },
  };

  const stageMeta = stageMap[state.phase] ?? stageMap.menu;
  const progressPercent =
    state.screen === "match" ? Math.round((state.round / state.maxRounds) * 100) : 0;
  elements.roundLabel.textContent = `Round ${state.round} / ${state.maxRounds}`;
  elements.phasePill.textContent = stageMeta.label;
  elements.stageLabel.textContent = stageMeta.copy;
  elements.matchModeLabel.textContent =
    state.mode === "solo"
      ? state.players[1]
        ? `Solo mode • curated 40-card player deck vs ${state.players[1].name}'s themed deck.`
        : "Solo mode • curated 40-card player deck vs themed computer opponent."
      : state.mode === "duo"
        ? "Two-player mode • preserved tag setup and current war-mode rules."
        : "";

  if (elements.roundProgressFill) {
    elements.roundProgressFill.style.width = `${progressPercent}%`;
  }
}

function renderScreenVisibility() {
  elements.heroPanel.classList.toggle("hidden", state.screen === "match");
  elements.menuScreen.classList.toggle("hidden", state.screen !== "menu");
  elements.soloScreen.classList.toggle("hidden", state.screen !== "solo-setup");
  elements.duoScreen.classList.toggle("hidden", state.screen !== "duo-setup");
  elements.hudPanel.classList.toggle("hidden", state.screen !== "match");
  elements.matchArea.classList.toggle("hidden", state.screen !== "match");
  elements.logPanel.classList.toggle("hidden", state.screen !== "match");
}

function render() {
  document.body.dataset.screen = state.screen;
  renderScreenVisibility();
  renderSoloBuilder();
  renderStageText();
  renderPlayerPanel(0);
  renderPlayerPanel(1);
  renderOpponentPortrait();
  renderPlayedCards();
  renderRoundSummary();
  renderButtons();
  renderLog();
}

elements.openSoloModeBtn.addEventListener("click", () => {
  state.screen = "solo-setup";
  render();
});

elements.openDuoModeBtn.addEventListener("click", () => {
  state.screen = "duo-setup";
  render();
});

elements.backFromSoloBtn.addEventListener("click", () => {
  state.screen = "menu";
  render();
});

elements.backFromDuoBtn.addEventListener("click", () => {
  state.screen = "menu";
  render();
});

elements.setupForm.addEventListener("submit", buildDuoMatch);
elements.soloStartBtn.addEventListener("click", buildSoloMatch);
elements.soloAddCategoriesBtn.addEventListener("click", addSoloCardsByTags);
elements.soloRemoveCategoriesBtn.addEventListener("click", removeSoloCardsByTags);
elements.soloAutofillBtn.addEventListener("click", autoFillSoloDeck);
elements.soloClearBtn.addEventListener("click", clearSoloDeck);
elements.soloSearch.addEventListener("input", render);

elements.lockInBtn.addEventListener("click", lockInPrimaryCards);
elements.resolveBtn.addEventListener("click", resolveRound);
elements.resolveTiebreakBtn.addEventListener("click", resolveTiebreak);
elements.nextRoundBtn.addEventListener("click", advanceRound);
elements.resetBtn.addEventListener("click", resetMatchToMenu);

elements.challengeBtns.forEach((button, playerIndex) => {
  button.addEventListener("click", () => beginDispute("challenge", playerIndex));
});

elements.bullshitBtns.forEach((button, playerIndex) => {
  button.addEventListener("click", () => beginDispute("bullshit", playerIndex));
});

buildTagInputs();
render();
initializeNpcContent();
