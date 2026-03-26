const TAGS = [
  { id: "family", label: "Family Systems" },
  { id: "identity", label: "Identity" },
  { id: "health", label: "Mental Health" },
  { id: "internet", label: "Internet Damage" },
  { id: "culture", label: "Cultural Baggage" },
  { id: "religion", label: "Religious Trauma" },
  { id: "collapse", label: "Collapse Dread" },
  { id: "work", label: "Work and Class" },
];

const CARD_POOL = [
  {
    id: "dead-father",
    title: "Dead Father",
    points: 9,
    tags: ["family"],
  },
  {
    id: "abusive-stepfather",
    title: "Abusive Stepfather",
    points: 8,
    tags: ["family"],
  },
  {
    id: "mentally-ill-parents",
    title: "Mentally Ill Parents",
    points: 8,
    tags: ["family", "health"],
  },
  {
    id: "religious-trauma",
    title: "Religious Trauma",
    points: 7,
    tags: ["family", "religion"],
  },
  {
    id: "translator-parents",
    title: "Translator for Your Immigrant Parents",
    points: 7,
    tags: ["family", "culture"],
  },
  {
    id: "ramen-neglect",
    title: "Ramen and Emotional Neglect",
    points: 7,
    tags: ["family", "work"],
  },
  {
    id: "smart-disappointment",
    title: "The Smart One and The Disappointment",
    points: 6,
    tags: ["family", "health"],
  },
  {
    id: "autistic",
    title: "Autistic",
    points: 6,
    tags: ["identity", "health"],
  },
  {
    id: "adhd-faking",
    title: "Diagnosed ADHD but Still Think You're Faking It",
    points: 6,
    tags: ["identity", "health"],
  },
  {
    id: "called-slur",
    title: "Got Called a Slur Before Puberty",
    points: 8,
    tags: ["identity", "culture"],
  },
  {
    id: "therapist-worse",
    title: "Saw a Therapist Once and Got Worse",
    points: 6,
    tags: ["health"],
  },
  {
    id: "internet-validation",
    title: "Addicted to Internet Validation",
    points: 5,
    tags: ["internet", "health"],
  },
  {
    id: "deviantart-phase",
    title: "You Had a DeviantArt Phase",
    points: 4,
    tags: ["internet"],
  },
  {
    id: "tumblr-bible",
    title: "Used Tumblr Like a Bible",
    points: 5,
    tags: ["internet"],
  },
  {
    id: "linkin-park",
    title: "Thought Linkin Park Understood You",
    points: 4,
    tags: ["internet", "culture"],
  },
  {
    id: "world-war-live",
    title: "Learned About World War 2 and Then Watched It Rhyming in Real Time",
    points: 8,
    tags: ["collapse", "culture"],
  },
  {
    id: "news-propaganda",
    title: "Realizing the News Is Propaganda Too",
    points: 6,
    tags: ["collapse", "culture"],
  },
  {
    id: "aliens-abduct",
    title: "Begged Aliens or God to Abduct You",
    points: 5,
    tags: ["collapse", "religion"],
  },
  {
    id: "too-unwell-drafted",
    title: "Too Mentally Unwell to Be Drafted",
    points: 7,
    tags: ["health", "collapse"],
  },
  {
    id: "emotional-support-gifted",
    title: "Emotional Support Gifted Kid",
    points: 5,
    tags: ["health", "culture"],
  },
  {
    id: "cant-afford-therapy",
    title: "Can't Afford Therapy and Psychoanalyze Your Therapist",
    points: 7,
    tags: ["health", "work"],
  },
  {
    id: "matrix-too-young",
    title: "Saw The Matrix Too Young",
    points: 4,
    tags: ["culture", "internet"],
  },
  {
    id: "fbi-good-guys",
    title: "Grew Up Thinking the FBI Were the Good Guys",
    points: 5,
    tags: ["culture", "collapse"],
  },
  {
    id: "black-sites",
    title: "You Know What Black Sites Are and Sleep Worse Because of It",
    points: 7,
    tags: ["culture", "collapse"],
  },
  {
    id: "spiritual-awakening",
    title: "Became Spiritually Awakened Through Mental Instability",
    points: 6,
    tags: ["health", "religion"],
  },
  {
    id: "deleted-app-soul",
    title: "Had to Delete an App to Save Your Soul",
    points: 5,
    tags: ["internet", "health"],
  },
  {
    id: "too-broken-to-work",
    title: "Too Broken to Work but Too Broke to Rest",
    points: 8,
    tags: ["work", "health"],
  },
  {
    id: "trauma-bond-ghosted",
    title: "Trauma-Bonded and Then Ghosted",
    points: 6,
    tags: ["internet", "health"],
  },
  {
    id: "first-aware-trauma",
    title: "First One in the Family to Notice Everyone Is Traumatized",
    points: 7,
    tags: ["family", "health"],
  },
  {
    id: "phone-lifeline-abuser",
    title: "Your Phone Is Your Lifeline and Your Abuser",
    points: 6,
    tags: ["internet", "health"],
  },
  {
    id: "betrayal-arc",
    title: "Every Friend Group Has a Betrayal Arc",
    points: 6,
    tags: ["internet", "identity"],
  },
  {
    id: "self-aware",
    title: "At Least I'm Self-Aware",
    points: 4,
    tags: ["health"],
  },
  {
    id: "radicalized-fanfiction",
    title: "Radicalized by Fanfiction",
    points: 5,
    tags: ["internet", "culture"],
  },
  {
    id: "nun-monk-witch",
    title: "Considered Becoming a Nun, Monk, Witch, or Cryptid",
    points: 5,
    tags: ["religion", "health"],
  },
  {
    id: "war-crime-spite",
    title: "Know Which War Crime You Would Commit Out of Spite",
    points: 7,
    tags: ["collapse", "culture"],
  },
  {
    id: "cried-during-meme",
    title: "Cried During a Meme",
    points: 4,
    tags: ["internet", "health"],
  },
  {
    id: "recession-teen",
    title: "Lived Through the Recession as a Teen",
    points: 6,
    tags: ["work", "culture"],
  },
  {
    id: "covid-stole-event",
    title: "COVID Stole Your Graduation, Wedding, or Funeral",
    points: 8,
    tags: ["collapse", "culture"],
  },
  {
    id: "simulation-glitching",
    title: "The Simulation Is Glitching Again",
    points: 5,
    tags: ["collapse", "internet"],
  },
];

const SETTINGS = {
  maxRounds: 5,
  handSize: 10,
  challengeUses: 3,
  bullshitUses: 3,
};

const elements = {
  setupForm: document.querySelector("#setup-form"),
  playerNameInputs: [
    document.querySelector("#player-0-name"),
    document.querySelector("#player-1-name"),
  ],
  tagContainers: [
    document.querySelector("#player-0-tags"),
    document.querySelector("#player-1-tags"),
  ],
  hudPanel: document.querySelector("#hud-panel"),
  matchArea: document.querySelector("#match-area"),
  logPanel: document.querySelector("#log-panel"),
  roundLabel: document.querySelector("#round-label"),
  stageLabel: document.querySelector("#stage-label"),
  scoreboard: document.querySelector("#scoreboard"),
  playerPanels: [
    document.querySelector("#player-0-panel"),
    document.querySelector("#player-1-panel"),
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
  round: 1,
  maxRounds: SETTINGS.maxRounds,
  phase: "setup",
  players: [],
  roundState: createFreshRoundState(),
  log: [],
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
  return CARD_POOL.find((card) => card.id === cardId) ?? null;
}

function selectedTagsForPlayer(playerIndex) {
  return Array.from(
    elements.tagContainers[playerIndex].querySelectorAll("input:checked"),
  ).map((input) => input.value);
}

function buildTagInputs() {
  elements.tagContainers.forEach((container, playerIndex) => {
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
}

function buildHand(selectedTags) {
  const matchingCards = CARD_POOL.filter((card) =>
    selectedTags.some((tag) => card.tags.includes(tag)),
  );
  const fallbackCards = CARD_POOL.filter(
    (card) => !matchingCards.some((match) => match.id === card.id),
  );
  const combinedPool = shuffle([...matchingCards, ...fallbackCards]);

  return combinedPool.slice(0, SETTINGS.handSize);
}

function createPlayer(playerIndex) {
  const name = elements.playerNameInputs[playerIndex].value.trim() || `Player ${playerIndex + 1}`;
  const tags = selectedTagsForPlayer(playerIndex);

  return {
    name,
    tags,
    score: 0,
    hand: buildHand(tags),
    selectedCardId: null,
    followUpCardId: null,
    challengesLeft: SETTINGS.challengeUses,
    bullshitLeft: SETTINGS.bullshitUses,
    handVisible: false,
  };
}

function buildMatch(event) {
  event.preventDefault();

  state.round = 1;
  state.maxRounds = SETTINGS.maxRounds;
  state.phase = "selecting";
  state.players = [createPlayer(0), createPlayer(1)];
  state.roundState = createFreshRoundState();
  state.log = [];

  elements.hudPanel.classList.remove("hidden");
  elements.matchArea.classList.remove("hidden");
  elements.logPanel.classList.remove("hidden");

  addLogEntry("Match generated. Both players can reveal their own hands and choose a primary card.");
  render();
}

function handleCardClick(playerIndex, cardId) {
  if (state.phase === "selecting") {
    state.players[playerIndex].selectedCardId = cardId;
  } else if (state.phase === "tiebreak-selecting") {
    state.players[playerIndex].followUpCardId = cardId;
  }

  render();
}

function toggleHandVisibility(playerIndex) {
  state.players[playerIndex].handVisible = !state.players[playerIndex].handVisible;
  render();
}

function lockInPrimaryCards() {
  if (!state.players.every((player) => player.selectedCardId)) {
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

  const defaultWinner = state.roundState.defaultWinnerIndex;

  if (defaultWinner === null) {
    elements.roundSummary.textContent =
      "Primary cards are tied on visible value. Resolve the tiebreak to continue.";
    addLogEntry("Primary cards tied. Follow-up cards are now required.");
  } else {
    addLogEntry(
      `${state.players[defaultWinner].name} leads the round by default. Resolve the clash or spend a dispute token.`,
    );
  }

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

function beginDispute(disputeType, playerIndex) {
  if (state.phase !== "revealed") {
    return;
  }

  if (disputeType === "challenge" && state.players[playerIndex].challengesLeft <= 0) {
    return;
  }

  if (disputeType === "bullshit" && state.players[playerIndex].bullshitLeft <= 0) {
    return;
  }

  if (disputeType === "challenge") {
    state.players[playerIndex].challengesLeft -= 1;
  } else {
    state.players[playerIndex].bullshitLeft -= 1;
  }

  state.phase = "tiebreak-selecting";
  state.roundState.disputeType = disputeType;
  state.roundState.disputeBy = playerIndex;
  state.players.forEach((player) => {
    player.followUpCardId = null;
  });

  addLogEntry(
    `${state.players[playerIndex].name} spent a ${disputeType} token. Both players must commit a follow-up card.`,
  );

  render();
}

function resolveRound() {
  if (state.phase !== "revealed") {
    return;
  }

  if (state.roundState.defaultWinnerIndex === null) {
    state.phase = "tiebreak-selecting";
    addLogEntry("No default winner. Proceeding to follow-up cards.");
    render();
    return;
  }

  finalizeRound(state.roundState.defaultWinnerIndex);
}

function resolveTiebreak() {
  if (
    state.phase !== "tiebreak-selecting" ||
    !state.players.every((player) => player.followUpCardId)
  ) {
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
  return `Match over. ${winner.name} wins ${winner.score} to ${
    winner === firstPlayer ? secondPlayer.score : firstPlayer.score
  }.`;
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

function resetMatch() {
  state.round = 1;
  state.phase = "setup";
  state.players = [];
  state.roundState = createFreshRoundState();
  state.log = [];

  elements.hudPanel.classList.add("hidden");
  elements.matchArea.classList.add("hidden");
  elements.logPanel.classList.add("hidden");
  elements.roundSummary.textContent = "Generate a match to start playing.";
  elements.playedCardSlots.forEach((slot) => {
    slot.className = "played-card empty-slot";
    slot.textContent = "No card locked in";
  });
  render();
}

function addLogEntry(message) {
  state.log.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
  });
}

function buildCardMarkup(card) {
  return `
    <div class="card-points">${card.points} pts</div>
    <div class="card-title">${card.title}</div>
    <div class="card-tags">
      ${card.tags
        .map((tag) => `<span class="player-tag">${tagLabel(tag)}</span>`)
        .join("")}
    </div>
  `;
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

  const handMarkup = player.handVisible
    ? player.hand
        .map((card) => {
          const isDisabled =
            (!isSelectingPrimary && !isSelectingFollowUp) ||
            (isSelectingFollowUp && card.id === primaryCardId);
          const isSelected = currentSelectionId === card.id;

          return `
            <button
              class="hand-card ${isSelected ? "is-selected" : ""}"
              type="button"
              data-player-index="${playerIndex}"
              data-card-id="${card.id}"
              ${isDisabled ? "disabled" : ""}
            >
              ${buildCardMarkup(card)}
            </button>
          `;
        })
        .join("")
    : `<div class="meta-line">Hand hidden. Reveal only when it is your turn to choose.</div>`;

  elements.playerPanels[playerIndex].innerHTML = `
    <div class="player-header">
      <div>
        <p class="player-name">${player.name}</p>
        <p class="meta-line">Tags: ${player.tags.map(tagLabel).join(", ") || "Open pool"}</p>
      </div>
      <button class="ghost-button toggle-hand-button" type="button" data-player-index="${playerIndex}">
        ${player.handVisible ? "Hide Hand" : "Reveal Hand"}
      </button>
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

  elements.playerPanels[playerIndex]
    .querySelector(".toggle-hand-button")
    .addEventListener("click", () => toggleHandVisibility(playerIndex));

  elements.playerPanels[playerIndex]
    .querySelectorAll(".hand-card")
    .forEach((button) => {
      button.addEventListener("click", () => {
        handleCardClick(
          Number(button.dataset.playerIndex),
          button.dataset.cardId,
        );
      });
    });
}

function renderPlayedCards() {
  [0, 1].forEach((playerIndex) => {
    const primaryCard = state.roundState.primarySelections[playerIndex];
    const followUpCard = state.roundState.followUpSelections[playerIndex];
    const slot = elements.playedCardSlots[playerIndex];

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

function renderScoreboard() {
  if (!state.players.length) {
    elements.scoreboard.innerHTML = "";
    return;
  }

  elements.scoreboard.innerHTML = state.players
    .map(
      (player) => `
        <article class="score-card">
          <strong>${player.name}</strong>
          <span class="score-value">${player.score}</span>
          <span class="meta-line">${player.hand.length} cards left in hand</span>
        </article>
      `,
    )
    .join("");
}

function renderRoundSummary() {
  if (!state.players.length) {
    elements.roundSummary.textContent = "Generate a match to start playing.";
    return;
  }

  const firstPrimary = state.roundState.primarySelections[0];
  const secondPrimary = state.roundState.primarySelections[1];

  if (state.phase === "selecting") {
    elements.roundSummary.textContent =
      "Both players choose a primary card. Lock them in once both selections are ready.";
    return;
  }

  if (state.phase === "revealed") {
    if (state.roundState.defaultWinnerIndex === null) {
      elements.roundSummary.textContent =
        "Primary card values are tied. Resolve the tiebreak to continue.";
      return;
    }

    const leader = state.players[state.roundState.defaultWinnerIndex];
    elements.roundSummary.textContent = `${leader.name} is ahead by default with ${
      state.roundState.primarySelections[state.roundState.defaultWinnerIndex].points
    } points against ${
      state.roundState.primarySelections[state.roundState.defaultWinnerIndex === 0 ? 1 : 0].points
    }. Accept the result or spend a dispute token.`;
    return;
  }

  if (state.phase === "tiebreak-selecting") {
    elements.roundSummary.textContent =
      "Each player must choose one follow-up card. The combined total decides the clash.";
    return;
  }

  if (state.phase === "resolved" || state.phase === "match-over") {
    if (state.roundState.winnerIndex === null) {
      elements.roundSummary.textContent =
        "The round ended in a stalemate. No one claimed the points in the pool.";
      return;
    }

    const winner = state.players[state.roundState.winnerIndex];
    const firstTotal =
      firstPrimary.points + (state.roundState.followUpSelections[0]?.points ?? 0);
    const secondTotal =
      secondPrimary.points + (state.roundState.followUpSelections[1]?.points ?? 0);

    elements.roundSummary.textContent = `${winner.name} wins the clash ${firstTotal} to ${secondTotal} and captures ${state.roundState.poolPoints} points.`;
  }
}

function renderButtons() {
  const bothPrimarySelected = state.players.every((player) => player.selectedCardId);
  const bothFollowUpsSelected = state.players.every((player) => player.followUpCardId);

  elements.lockInBtn.disabled = !(state.phase === "selecting" && bothPrimarySelected);
  elements.resolveBtn.disabled = state.phase !== "revealed";
  elements.resolveTiebreakBtn.disabled = !(
    state.phase === "tiebreak-selecting" && bothFollowUpsSelected
  );
  elements.nextRoundBtn.disabled = state.phase !== "resolved";

  state.players.forEach((player, playerIndex) => {
    elements.challengeBtns[playerIndex].textContent = `${player.name} Challenge`;
    elements.bullshitBtns[playerIndex].textContent = `${player.name} Bullshit`;
    elements.challengeBtns[playerIndex].disabled =
      state.phase !== "revealed" || player.challengesLeft <= 0;
    elements.bullshitBtns[playerIndex].disabled =
      state.phase !== "revealed" || player.bullshitLeft <= 0;
  });
}

function renderLog() {
  elements.matchLog.innerHTML = state.log
    .map((entry) => `<li class="log-entry">${entry.message}</li>`)
    .join("");
}

function renderStageText() {
  const stageMap = {
    setup: "Generate a match to begin.",
    selecting: "Secret selection phase",
    revealed: "Default result is visible",
    "tiebreak-selecting": "Follow-up cards are required",
    resolved: "Round resolved",
    "match-over": "Match complete",
  };

  elements.roundLabel.textContent = `Round ${state.round} / ${state.maxRounds}`;
  elements.stageLabel.textContent = stageMap[state.phase];
}

function render() {
  renderStageText();
  renderScoreboard();
  renderPlayerPanel(0);
  renderPlayerPanel(1);
  renderPlayedCards();
  renderRoundSummary();
  renderButtons();
  renderLog();
}

elements.setupForm.addEventListener("submit", buildMatch);
elements.lockInBtn.addEventListener("click", lockInPrimaryCards);
elements.resolveBtn.addEventListener("click", resolveRound);
elements.resolveTiebreakBtn.addEventListener("click", resolveTiebreak);
elements.nextRoundBtn.addEventListener("click", advanceRound);
elements.resetBtn.addEventListener("click", resetMatch);

elements.challengeBtns.forEach((button, playerIndex) => {
  button.addEventListener("click", () => beginDispute("challenge", playerIndex));
});

elements.bullshitBtns.forEach((button, playerIndex) => {
  button.addEventListener("click", () => beginDispute("bullshit", playerIndex));
});

buildTagInputs();
render();
