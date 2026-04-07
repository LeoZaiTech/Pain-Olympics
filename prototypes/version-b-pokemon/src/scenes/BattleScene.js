import {
  buildRandomDeck, buildNpcDeck, createPlayer, createFreshRoundState,
  chooseComputerCard, lockIn, finalizeRound, resolveTiebreak, advanceRound,
  pickNpcLine, cardById, shuffle,
} from '../shared/gameEngine.js';
import { CARD_POOL, SETTINGS, tagLabel } from '../shared/data.js';

// ── palette ──────────────────────────────────────────────────────────────────
const C = {
  DARKEST: 0x0F380F, DARK: 0x306230, MID: 0x8BAC0F, LIGHT: 0x9BBC0F,
  WHITE: 0xF8F8F8,   HP_ON: 0xE84818,  HP_OFF: 0x4a2e20,
  S_DARKEST: '#0F380F', S_LIGHT: '#9BBC0F', S_WHITE: '#F8F8F8', S_MID: '#8BAC0F',
};
const FONT  = '"Press Start 2P", monospace';
const W = 480, H = 320;
// layout zones
const DLG_Y = 230, DLG_H = 90;          // dialogue strip
const ACT_X = 310, ACT_W = 168, ACT_H = DLG_H; // action menu (right half)
const DLG_TXT_X = 10, DLG_TXT_W = 295;  // text zone (left half)
const NPC_BOX  = { x: 6,   y: 8,   w: 210, h: 66 };
const PLAY_BOX = { x: 260, y: 172, w: 214, h: 54 };

// ── helpers ───────────────────────────────────────────────────────────────────
function drawBox(gfx, x, y, w, h, fill, border) {
  gfx.fillStyle(fill, 1);   gfx.fillRect(x, y, w, h);
  gfx.lineStyle(3, border, 1); gfx.strokeRect(x, y, w, h);
}

// ─────────────────────────────────────────────────────────────────────────────
export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
    this.gs          = null;   // game state
    this.uiMode      = 'none'; // dialogue | action | card-pick | animating
    this.dQueue      = [];     // pending dialogue lines
    this.dTyping     = false;
    this.dFull       = '';     // full current line
    this.dShown      = '';     // chars shown so far
    this.dTimer      = null;
    this.dCallback   = null;   // called after last line dismissed
    this.actionIdx   = 0;
    this.actionOpts  = [];
    this.cardIdx     = 0;
    this.cardScroll  = 0;
    this.cardHand    = [];
    this.cardDone    = null;
    this.VISIBLE_CARDS = 5;
    // UI refs
    this.statusGfx   = null;
    this.dlgGfx      = null;
    this.dlgText     = null;
    this.dlgArrow    = null;
    this.actGfx      = null;
    this.actTexts    = [];
    this.cardPanel   = null;
    this.cardTexts   = [];
    this.playedGfx   = null;
    this.playedTexts = [];
    this.roundLabel  = null;
  }

  // ── lifecycle ───────────────────────────────────────────────────────────────
  create() {
    const npcDecks  = this.cache.json.get('npc-decks');
    const npcDialogue = this.cache.json.get('npc-dialogue');
    const extraCards  = Object.values(npcDecks).flatMap(p => p.exclusiveCards || []);

    const human = createPlayer({
      name: 'YOU',
      hand: buildRandomDeck(SETTINGS.soloDeckSize),
    });
    const npc = createPlayer({
      name: 'WALMART KAREN',
      hand: buildNpcDeck('walmart-karen', npcDecks),
      isComputer: true,
      npcKey: 'walmart-karen',
      portraitKey: 'karen',
    });
    npc.hand = [...npc.hand, ...extraCards.filter(ec => !npc.hand.find(c => c.id === ec.id))].slice(0, SETTINGS.soloDeckSize);

    this.gs = {
      round: 1,
      maxRounds: SETTINGS.maxRounds,
      phase: 'selecting',
      players: [human, npc],
      roundState: createFreshRoundState(),
      npcDialogue,
      extraCards,
    };

    this._buildScene();
    this._setupKeys();
    this._startBattle();
  }

  update() {
    if      (this.uiMode === 'dialogue')  this._inputDialogue();
    else if (this.uiMode === 'action')    this._inputAction();
    else if (this.uiMode === 'card-pick') this._inputCardPick();
  }

  // ── scene construction ──────────────────────────────────────────────────────
  _buildScene() {
    this._drawBackground();
    this._drawNpcSprite();
    this._drawPlayerSprite();
    this.statusGfx = this.add.graphics();
    this._drawStatus();
    this._buildDialogueBox();
    this._buildActionMenu();
    this._buildCardPanel();
    this._buildPlayedCards();
    this.roundLabel = this.add.text(W / 2, DLG_Y - 14, '', {
      fontFamily: FONT, fontSize: '7px', color: C.S_LIGHT,
    }).setOrigin(0.5, 1).setDepth(5);
  }

  _drawBackground() {
    // sky
    this.add.rectangle(0, 0,    W, 110, C.LIGHT).setOrigin(0, 0);
    this.add.rectangle(0, 110,  W, 30,  C.MID).setOrigin(0, 0);
    this.add.rectangle(0, 140,  W, 90,  C.DARKEST).setOrigin(0, 0);
    // NPC platform (upper right)
    const gp = this.add.graphics();
    gp.fillStyle(C.DARK, 1); gp.fillEllipse(370, 118, 180, 22);
    gp.fillStyle(C.DARKEST, 1); gp.fillRect(280, 118, 200, 8);
    // player platform (lower left)
    gp.fillStyle(C.DARK, 1); gp.fillEllipse(100, 196, 140, 20);
    gp.fillStyle(C.DARKEST, 1); gp.fillRect(30, 196, 150, 8);
  }

  _drawNpcSprite() {
    // portrait frame
    const x = 308, y = 20, w = 110, h = 100;
    const g = this.add.graphics();
    g.fillStyle(C.DARKEST, 1); g.fillRect(x - 2, y - 2, w + 4, h + 4);
    g.lineStyle(3, C.MID, 1);  g.strokeRect(x - 2, y - 2, w + 4, h + 4);
    // portrait image
    const img = this.add.image(x, y, 'karen').setOrigin(0, 0);
    img.setDisplaySize(w, h);
  }

  _drawPlayerSprite() {
    const g = this.add.graphics();
    const cx = 90, cy = 178;
    // shadow
    g.fillStyle(C.DARKEST, 0.6); g.fillEllipse(cx, cy + 12, 44, 8);
    // legs
    g.fillStyle(C.DARKEST, 1);
    g.fillRect(cx - 14, cy - 2, 11, 16);
    g.fillRect(cx +  3, cy - 2, 11, 16);
    // shoes
    g.fillStyle(C.MID, 1);
    g.fillRect(cx - 15, cy + 12, 13, 5);
    g.fillRect(cx +  2, cy + 12, 13, 5);
    // torso
    g.fillStyle(C.DARK, 1); g.fillRect(cx - 16, cy - 22, 32, 22);
    // arms
    g.fillStyle(C.MID, 1);
    g.fillRect(cx - 24, cy - 20, 10, 16);
    g.fillRect(cx + 14, cy - 20, 10, 16);
    // head
    g.fillStyle(C.LIGHT, 1); g.fillRect(cx - 10, cy - 38, 20, 18);
    // cap
    g.fillStyle(C.DARKEST, 1);
    g.fillRect(cx - 12, cy - 44, 24, 8);
    g.fillRect(cx - 10, cy - 38, 20, 4);
  }

  // ── status boxes ──────────────────────────────────────────────────────────
  _drawStatus() {
    const g = this.statusGfx;
    g.clear();
    const [human, npc] = this.gs.players;

    // NPC box (upper left)
    drawBox(g, NPC_BOX.x, NPC_BOX.y, NPC_BOX.w, NPC_BOX.h, C.WHITE, C.DARKEST);
    // Player box (lower right)
    drawBox(g, PLAY_BOX.x, PLAY_BOX.y, PLAY_BOX.w, PLAY_BOX.h, C.WHITE, C.DARKEST);

    // dots helper
    const dot = (bx, by, total, remaining, color) => {
      for (let i = 0; i < total; i++) {
        g.fillStyle(i < remaining ? color : C.HP_OFF, 1);
        g.fillCircle(bx + i * 12, by, 4);
      }
    };

    // NPC dots
    dot(NPC_BOX.x + 10, NPC_BOX.y + 38, 3, npc.challengesLeft,  C.HP_ON);
    dot(NPC_BOX.x + 10, NPC_BOX.y + 54, 3, npc.bullshitLeft,     0x1a6bbf);

    // Player dots
    dot(PLAY_BOX.x + 10, PLAY_BOX.y + 26, 3, human.challengesLeft, C.HP_ON);
    dot(PLAY_BOX.x + 10, PLAY_BOX.y + 42, 3, human.bullshitLeft,    0x1a6bbf);

    // Render names & scores via text objects (destroy old ones first)
    if (this._statusTexts) this._statusTexts.forEach(t => t.destroy());
    this._statusTexts = [];
    const st = (x, y, txt, size = '7px', col = C.S_DARKEST) => {
      const t = this.add.text(x, y, txt, { fontFamily: FONT, fontSize: size, color: col }).setDepth(4);
      this._statusTexts.push(t);
      return t;
    };

    const npcName = npc.name.length > 12 ? npc.name.slice(0, 12) : npc.name;
    st(NPC_BOX.x + 6,  NPC_BOX.y + 6,  npcName, '7px');
    st(NPC_BOX.x + 6,  NPC_BOX.y + 20, `PTS:${npc.score}`, '6px', '#306230');
    st(NPC_BOX.x + 50, NPC_BOX.y + 33, 'CHAL', '5px', C.S_DARKEST);
    st(NPC_BOX.x + 50, NPC_BOX.y + 49, 'BS', '5px', '#1a6bbf');

    st(PLAY_BOX.x + 6,  PLAY_BOX.y + 6,  'YOU', '7px');
    st(PLAY_BOX.x + 6,  PLAY_BOX.y + 18, `PTS:${human.score}`, '6px', '#306230');
    st(PLAY_BOX.x + 50, PLAY_BOX.y + 21, 'CHAL', '5px', C.S_DARKEST);
    st(PLAY_BOX.x + 50, PLAY_BOX.y + 37, 'BS', '5px', '#1a6bbf');
  }

  // ── dialogue box ──────────────────────────────────────────────────────────
  _buildDialogueBox() {
    this.dlgGfx = this.add.graphics().setDepth(8);
    this._drawDlgBox();
    this.dlgText = this.add.text(DLG_TXT_X + 4, DLG_Y + 8, '', {
      fontFamily: FONT, fontSize: '8px', color: C.S_DARKEST,
      wordWrap: { width: DLG_TXT_W - 8 }, lineSpacing: 6,
    }).setDepth(10);
    this.dlgArrow = this.add.text(DLG_TXT_X + DLG_TXT_W - 12, DLG_Y + DLG_H - 14, '▼', {
      fontFamily: FONT, fontSize: '8px', color: C.S_DARKEST,
    }).setDepth(10).setVisible(false);
    this.time.addEvent({ delay: 400, loop: true, callback: () => {
      if (this.dlgArrow.visible) this.dlgArrow.setAlpha(this.dlgArrow.alpha === 1 ? 0.2 : 1);
    }});
  }

  _drawDlgBox() {
    const g = this.dlgGfx;
    g.clear();
    drawBox(g, 2, DLG_Y, W - 4, DLG_H, C.WHITE, C.DARKEST);
    // vertical divider for action menu
    g.lineStyle(2, C.DARKEST, 1);
    g.lineBetween(ACT_X - 2, DLG_Y + 4, ACT_X - 2, DLG_Y + DLG_H - 4);
  }

  // ── action menu ───────────────────────────────────────────────────────────
  _buildActionMenu() {
    this.actGfx = this.add.graphics().setDepth(9);
    this.actTexts = [];
    for (let i = 0; i < 4; i++) {
      this.actTexts.push(
        this.add.text(ACT_X + 20, DLG_Y + 10 + i * 18, '', {
          fontFamily: FONT, fontSize: '8px', color: C.S_DARKEST,
        }).setDepth(11).setVisible(false)
      );
    }
    this._actCursor = this.add.text(ACT_X + 6, DLG_Y + 10, '▶', {
      fontFamily: FONT, fontSize: '8px', color: C.S_DARKEST,
    }).setDepth(12).setVisible(false);
  }

  _showActionMenu(opts) {
    this.uiMode     = 'action';
    this.actionOpts = opts;
    this.actionIdx  = 0;
    this.actTexts.forEach((t, i) => {
      if (i < opts.length) { t.setText(opts[i].label).setVisible(true); }
      else                 { t.setVisible(false); }
    });
    this._actCursor.setVisible(true);
    this._refreshActionCursor();
  }

  _hideActionMenu() {
    this.actTexts.forEach(t => t.setVisible(false));
    this._actCursor.setVisible(false);
  }

  _refreshActionCursor() {
    this._actCursor.setY(DLG_Y + 10 + this.actionIdx * 18);
  }

  // ── card pick panel ──────────────────────────────────────────────────────
  _buildCardPanel() {
    this.cardPanel = this.add.graphics().setDepth(20).setVisible(false);
    this.cardTexts = [];
    // header
    this._cpHeader = this.add.text(W / 2, 8, '', {
      fontFamily: FONT, fontSize: '7px', color: C.S_LIGHT,
    }).setOrigin(0.5, 0).setDepth(22).setVisible(false);
    // row texts
    for (let i = 0; i < this.VISIBLE_CARDS; i++) {
      const row = this.add.text(16, 28 + i * 34, '', {
        fontFamily: FONT, fontSize: '7px', color: C.S_DARKEST,
        wordWrap: { width: W - 100 },
      }).setDepth(22).setVisible(false);
      const pts = this.add.text(W - 52, 28 + i * 34, '', {
        fontFamily: FONT, fontSize: '7px', color: C.S_DARKEST,
      }).setDepth(22).setVisible(false);
      const tag = this.add.text(W - 52, 28 + i * 34 + 12, '', {
        fontFamily: FONT, fontSize: '5px', color: '#306230',
      }).setDepth(22).setVisible(false);
      this.cardTexts.push({ row, pts, tag });
    }
    this._cpHint = this.add.text(W / 2, H - 8, '↑↓ MOVE   Z/ENTER SELECT   X/ESC CANCEL', {
      fontFamily: FONT, fontSize: '5px', color: '#306230',
    }).setOrigin(0.5, 1).setDepth(22).setVisible(false);
    this._cpCursor = this.add.text(6, 28, '▶', {
      fontFamily: FONT, fontSize: '8px', color: C.S_DARKEST,
    }).setDepth(23).setVisible(false);
  }

  _showCardPicker(hand, title, onSelect, onCancel) {
    this.uiMode    = 'card-pick';
    this.cardHand  = hand;
    this.cardDone  = onSelect;
    this.cardCancel = onCancel || null;
    this.cardIdx   = 0;
    this.cardScroll = 0;

    const g = this.cardPanel;
    g.clear();
    g.fillStyle(C.WHITE, 1); g.fillRect(0, 0, W, H);
    g.lineStyle(3, C.DARKEST, 1); g.strokeRect(2, 2, W - 4, H - 4);
    g.fillStyle(C.DARKEST, 1); g.fillRect(0, 0, W, 22);
    // row dividers
    for (let i = 0; i <= this.VISIBLE_CARDS; i++) {
      g.lineStyle(1, C.MID, 0.5); g.lineBetween(8, 22 + i * 34, W - 8, 22 + i * 34);
    }
    g.setVisible(true);

    this._cpHeader.setText(title).setVisible(true);
    this._cpHint.setVisible(true);
    this._cpCursor.setVisible(true);
    this.cardTexts.forEach(r => { r.row.setVisible(true); r.pts.setVisible(true); r.tag.setVisible(true); });
    this._refreshCardPicker();
  }

  _hideCardPicker() {
    this.cardPanel.setVisible(false);
    this._cpHeader.setVisible(false);
    this._cpHint.setVisible(false);
    this._cpCursor.setVisible(false);
    this.cardTexts.forEach(r => { r.row.setVisible(false); r.pts.setVisible(false); r.tag.setVisible(false); });
  }

  _refreshCardPicker() {
    const visible = this.cardHand.slice(this.cardScroll, this.cardScroll + this.VISIBLE_CARDS);
    visible.forEach((card, i) => {
      const { row, pts, tag } = this.cardTexts[i];
      const maxLen = 30;
      const title  = card.title.length > maxLen ? card.title.slice(0, maxLen) + '…' : card.title;
      row.setText(title);
      pts.setText(`${card.points}pt`);
      tag.setText(tagLabel(card.tags[0] || '').toUpperCase().slice(0, 10));
    });
    // blank unused rows
    for (let i = visible.length; i < this.VISIBLE_CARDS; i++) {
      const { row, pts, tag } = this.cardTexts[i];
      row.setText(''); pts.setText(''); tag.setText('');
    }
    const localIdx = this.cardIdx - this.cardScroll;
    this._cpCursor.setY(28 + localIdx * 34);
  }

  // ── played-cards display ─────────────────────────────────────────────────
  _buildPlayedCards() {
    this.playedGfx = this.add.graphics().setDepth(6);
    this.playedTexts = {
      label0: this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '6px', color: C.S_LIGHT }).setDepth(7).setVisible(false),
      card0:  this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '7px', color: C.S_DARKEST, wordWrap: { width: 110 } }).setDepth(7).setVisible(false),
      pts0:   this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '8px', color: C.S_DARKEST }).setDepth(7).setVisible(false),
      label1: this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '6px', color: C.S_LIGHT }).setDepth(7).setVisible(false),
      card1:  this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '7px', color: C.S_DARKEST, wordWrap: { width: 110 } }).setDepth(7).setVisible(false),
      pts1:   this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '8px', color: C.S_DARKEST }).setDepth(7).setVisible(false),
      vs:     this.add.text(W / 2, 158, 'VS', { fontFamily: FONT, fontSize: '10px', color: C.S_LIGHT }).setOrigin(0.5).setDepth(7).setVisible(false),
    };
  }

  _showPlayedCards() {
    const [human, npc] = this.gs.players;
    const [c0, c1] = this.gs.roundState.primarySelections;
    if (!c0 && !c1) { this._hidePlayedCards(); return; }

    const g = this.playedGfx;
    g.clear();

    // player card (left)
    if (c0) {
      drawBox(g, 20, 138, 120, 80, C.WHITE, C.DARKEST);
      this.playedTexts.label0.setPosition(24, 140).setText(human.name.slice(0,8)).setVisible(true);
      this.playedTexts.card0.setPosition(24, 154).setText(c0.title).setVisible(true);
      this.playedTexts.pts0.setPosition(24, 196).setText(`${c0.points} pts`).setVisible(true);
    }
    // npc card (right)
    if (c1) {
      drawBox(g, W - 140, 138, 120, 80, C.WHITE, C.DARKEST);
      this.playedTexts.label1.setPosition(W - 136, 140).setText(npc.name.slice(0,8)).setVisible(true);
      this.playedTexts.card1.setPosition(W - 136, 154).setText(c1.title).setVisible(true);
      this.playedTexts.pts1.setPosition(W - 136, 196).setText(`${c1.points} pts`).setVisible(true);
    }
    this.playedTexts.vs.setVisible(!!(c0 && c1));
  }

  _hidePlayedCards() {
    this.playedGfx.clear();
    Object.values(this.playedTexts).forEach(t => t.setVisible(false));
  }

  // ── dialogue system ──────────────────────────────────────────────────────
  say(lines, onDone) {
    this._hideActionMenu();
    this.dQueue    = Array.isArray(lines) ? [...lines] : [lines];
    this.dCallback = onDone || null;
    this._nextLine();
  }

  _nextLine() {
    if (!this.dQueue.length) {
      this.dlgArrow.setVisible(false);
      if (this.dCallback) { const cb = this.dCallback; this.dCallback = null; cb(); }
      return;
    }
    const line = this.dQueue.shift();
    this.dFull  = line;
    this.dShown = '';
    this.uiMode = 'dialogue';
    this.dTyping = true;
    this.dlgText.setText('');
    this.dlgArrow.setVisible(false);
    if (this.dTimer) this.dTimer.remove();
    let i = 0;
    this.dTimer = this.time.addEvent({
      delay: 32, repeat: line.length - 1,
      callback: () => {
        this.dShown += line[i++];
        this.dlgText.setText(this.dShown);
        if (i >= line.length) {
          this.dTyping = false;
          if (this.dQueue.length) { this.dlgArrow.setVisible(true); }
          else {
            // if no more lines, show arrow only when waiting for callback
            if (this.dCallback) this.dlgArrow.setVisible(true);
            else { this.dlgArrow.setVisible(false); }
          }
        }
      },
    });
  }

  _skipType() {
    if (this.dTimer) this.dTimer.remove();
    this.dShown  = this.dFull;
    this.dTyping = false;
    this.dlgText.setText(this.dShown);
    if (this.dQueue.length || this.dCallback) this.dlgArrow.setVisible(true);
    else this.dlgArrow.setVisible(false);
  }

  // ── keyboard input ───────────────────────────────────────────────────────
  _setupKeys() {
    this.keys = {
      up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      z:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      x:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      esc:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };
  }

  _just(key) { return Phaser.Input.Keyboard.JustDown(this.keys[key]); }
  _confirm() { return this._just('enter') || this._just('z'); }
  _cancel()  { return this._just('esc')   || this._just('x'); }

  _inputDialogue() {
    if (this._confirm()) {
      if (this.dTyping) { this._skipType(); return; }
      this.dlgArrow.setVisible(false);
      this._nextLine();
    }
  }

  _inputAction() {
    const opts = this.actionOpts;
    if (this._just('up'))   { this.actionIdx = (this.actionIdx - 1 + opts.length) % opts.length; this._refreshActionCursor(); }
    if (this._just('down')) { this.actionIdx = (this.actionIdx + 1) % opts.length; this._refreshActionCursor(); }
    if (this._confirm()) {
      const chosen = opts[this.actionIdx];
      this._hideActionMenu();
      if (chosen?.action) chosen.action();
    }
  }

  _inputCardPick() {
    const hand = this.cardHand;
    if (this._just('up')) {
      if (this.cardIdx > 0) {
        this.cardIdx--;
        if (this.cardIdx < this.cardScroll) this.cardScroll--;
        this._refreshCardPicker();
      }
    }
    if (this._just('down')) {
      if (this.cardIdx < hand.length - 1) {
        this.cardIdx++;
        if (this.cardIdx >= this.cardScroll + this.VISIBLE_CARDS) this.cardScroll++;
        this._refreshCardPicker();
      }
    }
    if (this._confirm()) {
      const card = hand[this.cardIdx];
      this._hideCardPicker();
      if (this.cardDone) { const cb = this.cardDone; this.cardDone = null; cb(card); }
    }
    if (this._cancel()) {
      this._hideCardPicker();
      if (this.cardCancel) { const cb = this.cardCancel; this.cardCancel = null; cb(); }
    }
  }

  // ── round label ──────────────────────────────────────────────────────────
  _updateRoundLabel() {
    this.roundLabel.setText(`ROUND ${this.gs.round}/${this.gs.maxRounds}`);
  }

  // ── battle flow ──────────────────────────────────────────────────────────
  _startBattle() {
    const npc = this.gs.players[1];
    const taunt = pickNpcLine(this.gs.npcDialogue, npc.npcKey, 'preTaunts') || 'You ready?';
    this._updateRoundLabel();
    this.say(
      [`${npc.name} wants to fight!`, `${npc.name}: "${taunt}"`, 'Round 1 begins.'],
      () => this._doSelecting(),
    );
  }

  _doSelecting() {
    this._hidePlayedCards();
    this._updateRoundLabel();
    const opts = [
      { label: 'FIGHT',   action: () => this._pickCard('primary') },
      { label: 'FORFEIT', action: () => this._goToMenu() },
    ];
    this.say(['What will you do?'], () => this._showActionMenu(opts));
  }

  _pickCard(cardType) {
    const human = this.gs.players[0];
    const title = cardType === 'primary' ? 'CHOOSE YOUR CARD' : 'PLAY A FOLLOW-UP';
    this._showCardPicker(
      human.hand,
      title,
      (card) => {
        this.gs.players[0] = { ...human, [cardType === 'primary' ? 'selectedCardId' : 'followUpCardId']: card.id };
        if (cardType === 'primary') this._afterHumanPrimary(card);
        else                        this._afterHumanFollowup(card);
      },
      () => this._doSelecting(),
    );
  }

  _afterHumanPrimary(humanCard) {
    // NPC picks
    this.gs.players[1] = chooseComputerCard(this.gs.players[1], 'primary');
    this.say([`${this.gs.players[1].name} locked in a card.`], () => {
      this.gs = lockIn(this.gs);
      this._doRevealed();
    });
  }

  _doRevealed() {
    const [c0, c1] = this.gs.roundState.primarySelections;
    const [human, npc] = this.gs.players;
    const defWin = this.gs.roundState.defaultWinnerIndex;
    this._showPlayedCards();

    const lines = [`${human.name} played: ${c0?.title}!`, `${npc.name} played: ${c1?.title}!`];
    if (defWin === null) {
      lines.push("It's a tie! Follow-up cards required.");
    } else {
      const leader = this.gs.players[defWin].name;
      lines.push(`${leader} leads by default!`);
    }
    this.say(lines, () => {
      if (defWin === null) {
        this._doTiebreak();
      } else {
        const canChallenge = human.challengesLeft > 0;
        const canBS        = human.bullshitLeft   > 0;
        const opts = [
          { label: 'ACCEPT',    action: () => this._resolveWith(defWin) },
          ...(canChallenge ? [{ label: 'CHALLENGE', action: () => this._dispute('challenge') }] : []),
          ...(canBS        ? [{ label: 'CALL  BS',  action: () => this._dispute('bullshit')  }] : []),
        ];
        this._showActionMenu(opts);
      }
    });
  }

  _dispute(type) {
    const player = this.gs.players[0];
    if (type === 'challenge') this.gs.players[0] = { ...player, challengesLeft: player.challengesLeft - 1 };
    else                      this.gs.players[0] = { ...player, bullshitLeft:   player.bullshitLeft   - 1 };
    this._drawStatus();
    this.say([`${player.name} spent a ${type} token!`], () => this._doTiebreak());
  }

  _doTiebreak() {
    this.say(['Play a follow-up card!'], () => this._pickCard('followup'));
  }

  _afterHumanFollowup(card) {
    this.gs.players[1] = chooseComputerCard(this.gs.players[1], 'followup');
    this.say([`${this.gs.players[1].name} throws in a follow-up!`], () => {
      const before = this.gs;
      this.gs = resolveTiebreak(this.gs);
      this._doResolved(before);
    });
  }

  _resolveWith(winnerIndex) {
    const before = { ...this.gs };
    this.gs = finalizeRound(this.gs, winnerIndex);
    this._doResolved(before);
  }

  _doResolved(before) {
    this._drawStatus();
    const { winnerIndex, poolPoints } = this.gs.roundState;
    const npc = this.gs.players[1];
    let resultLine;
    if (winnerIndex === null) {
      resultLine = `Stalemate! Nobody scores.`;
    } else {
      const winner = before.players[winnerIndex];
      resultLine = `${winner.name} takes ${poolPoints} pts!`;
    }
    const reactionKey = winnerIndex === 1 ? 'winLines' : 'lossLines';
    const reaction = pickNpcLine(this.gs.npcDialogue, npc.npcKey, reactionKey);
    const lines = [resultLine, ...(reaction ? [`${npc.name}: "${reaction}"`] : [])];

    if (this.gs.phase === 'match-over') {
      this.say(lines, () => this._doMatchOver());
    } else {
      this.say(lines, () => {
        this._showActionMenu([{ label: 'NEXT  ROUND', action: () => {
          this.gs = advanceRound(this.gs);
          this._doSelecting();
        }}]);
      });
    }
  }

  _doMatchOver() {
    this._hidePlayedCards();
    const [human, npc] = this.gs.players;
    let outcome;
    if (human.score > npc.score)       outcome = `YOU WIN!  ${human.score}-${npc.score}`;
    else if (npc.score > human.score)   outcome = `${npc.name} WINS  ${npc.score}-${human.score}`;
    else                                outcome = `DRAW!  ${human.score}-${npc.score}`;

    this.say(
      ['MATCH OVER!', outcome, 'Thanks for playing.'],
      () => this._showActionMenu([{ label: 'MAIN MENU', action: () => this._goToMenu() }]),
    );
  }

  _goToMenu() {
    this.scene.start('MenuScene');
  }
}
