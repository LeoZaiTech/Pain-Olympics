import {
  buildRandomDeck, buildNpcDeck, createPlayer, createFreshRoundState,
  chooseComputerCard, lockIn, finalizeRound, resolveTiebreak, advanceRound,
  pickNpcLine, cardById, shuffle,
} from '../shared/gameEngine.js';
import { CARD_POOL, SETTINGS, tagLabel } from '../shared/data.js';

// ── palette ──────────────────────────────────────────────────────────────────
const C = {
  // backgrounds
  SKY:     0xE8F8D0,  // light mint sky
  GROUND:  0x58A828,  // vibrant grass
  GROUND2: 0x386020,  // dark grass
  // platforms
  PLAT:    0x204810,
  // UI panels
  WHITE:   0xF8F8F8,
  BORDER:  0x202020,
  DARK:    0x306230,
  MID:     0x8BAC0F,
  LIGHT:   0x9BBC0F,
  // HP bar
  HP_HI:   0x00B800,
  HP_MID:  0xF8B800,
  HP_LOW:  0xE82000,
  HP_BG:   0x909090,
  // token dots
  CHAL_ON: 0xE84818,
  BS_ON:   0x1a6bbf,
  DOT_OFF: 0x909090,
  // strings
  S_DARK:    '#202020',
  S_DARKEST: '#0F380F',
  S_GREEN:   '#306230',
  S_LIGHT:   '#9BBC0F',
  S_WHITE:   '#F8F8F8',
  S_MID:     '#8BAC0F',
  S_GREY:    '#888888',
};
const FONT  = '"Press Start 2P", monospace';
const W = 480, H = 320;
// layout zones
const DLG_Y = 230, DLG_H = 90;
const ACT_X = 310, ACT_W = 168, ACT_H = DLG_H;
const DLG_TXT_X = 10, DLG_TXT_W = 295;
const NPC_BOX  = { x: 6,   y: 8,   w: 210, h: 44 };
const PLAY_BOX = { x: 260, y: 178, w: 214, h: 44 };

// ── helpers ───────────────────────────────────────────────────────────────────
function drawBox(gfx, x, y, w, h, fill, border) {
  gfx.fillStyle(fill, 1);    gfx.fillRect(x, y, w, h);
  gfx.lineStyle(3, border, 1); gfx.strokeRect(x, y, w, h);
}

// ─────────────────────────────────────────────────────────────────────────────
export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
    this.gs          = null;
    this.uiMode      = 'none';
    this.dQueue      = [];
    this.dTyping     = false;
    this.dFull       = '';
    this.dShown      = '';
    this.dTimer      = null;
    this.dCallback   = null;
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
  create(data) {
    const npcDecks    = this.cache.json.get('npc-decks');
    const npcDialogue = this.cache.json.get('npc-dialogue');
    const extraCards  = Object.values(npcDecks).flatMap(p => p.exclusiveCards || []);

    const playerDeck = data?.playerDeck || null;
    const human = createPlayer({
      name: 'YOU',
      hand: playerDeck || buildRandomDeck(SETTINGS.soloDeckSize),
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
    // Light sky
    this.add.rectangle(0, 0, W, 138, C.SKY).setOrigin(0, 0);
    // Thin ground divider
    this.add.rectangle(0, 138, W, 4, C.GROUND2).setOrigin(0, 0);
    // Ground
    this.add.rectangle(0, 142, W, 88, C.GROUND).setOrigin(0, 0);
    // NPC platform (upper right)
    const gp = this.add.graphics();
    gp.fillStyle(C.GROUND2, 1); gp.fillEllipse(370, 118, 180, 22);
    gp.fillStyle(C.PLAT, 1);    gp.fillRect(280, 118, 200, 8);
    // player platform (lower left)
    gp.fillStyle(C.GROUND2, 1); gp.fillEllipse(100, 196, 140, 20);
    gp.fillStyle(C.PLAT, 1);    gp.fillRect(30, 196, 150, 8);
  }

  _drawNpcSprite() {
    const x = 308, y = 20, w = 110, h = 100;
    const g = this.add.graphics();
    g.fillStyle(C.BORDER, 1); g.fillRect(x - 2, y - 2, w + 4, h + 4);
    g.lineStyle(3, C.MID, 1);  g.strokeRect(x - 2, y - 2, w + 4, h + 4);
    const img = this.add.image(x, y, 'karen').setOrigin(0, 0);
    img.setDisplaySize(w, h);
  }

  _drawPlayerSprite() {
    const g = this.add.graphics();
    const cx = 90, cy = 178;
    g.fillStyle(C.GROUND2, 0.6); g.fillEllipse(cx, cy + 12, 44, 8);
    g.fillStyle(C.BORDER, 1);
    g.fillRect(cx - 14, cy - 2, 11, 16);
    g.fillRect(cx +  3, cy - 2, 11, 16);
    g.fillStyle(C.MID, 1);
    g.fillRect(cx - 15, cy + 12, 13, 5);
    g.fillRect(cx +  2, cy + 12, 13, 5);
    g.fillStyle(C.DARK, 1); g.fillRect(cx - 16, cy - 22, 32, 22);
    g.fillStyle(C.MID, 1);
    g.fillRect(cx - 24, cy - 20, 10, 16);
    g.fillRect(cx + 14, cy - 20, 10, 16);
    g.fillStyle(C.LIGHT, 1); g.fillRect(cx - 10, cy - 38, 20, 18);
    g.fillStyle(C.BORDER, 1);
    g.fillRect(cx - 12, cy - 44, 24, 8);
    g.fillRect(cx - 10, cy - 38, 20, 4);
  }

  // ── HP bar helper ──────────────────────────────────────────────────────────
  _drawHpBar(g, x, y, w, h, hp, maxHp) {
    const pct   = Math.max(0, Math.min(1, hp / maxHp));
    const color = pct > 0.5 ? C.HP_HI : pct > 0.25 ? C.HP_MID : C.HP_LOW;
    g.fillStyle(C.HP_BG, 1); g.fillRect(x, y, w, h);
    g.fillStyle(color, 1);   g.fillRect(x, y, Math.round(w * pct), h);
    g.lineStyle(1, C.BORDER, 1); g.strokeRect(x, y, w, h);
  }

  // ── status boxes ──────────────────────────────────────────────────────────
  _drawStatus() {
    const g = this.statusGfx;
    g.clear();
    const [human, npc] = this.gs.players;

    drawBox(g, NPC_BOX.x,  NPC_BOX.y,  NPC_BOX.w,  NPC_BOX.h,  C.WHITE, C.BORDER);
    drawBox(g, PLAY_BOX.x, PLAY_BOX.y, PLAY_BOX.w, PLAY_BOX.h, C.WHITE, C.BORDER);

    // HP bars
    const BAR_W = 150;
    this._drawHpBar(g, NPC_BOX.x  + 8,  NPC_BOX.y  + 30, BAR_W, 7, npc.hp,   npc.maxHp);
    this._drawHpBar(g, PLAY_BOX.x + 8,  PLAY_BOX.y + 30, BAR_W, 7, human.hp, human.maxHp);

    if (this._statusTexts) this._statusTexts.forEach(t => t.destroy());
    this._statusTexts = [];
    const st = (x, y, txt, size = '7px', col = C.S_DARK) => {
      const t = this.add.text(x, y, txt, { fontFamily: FONT, fontSize: size, color: col }).setDepth(4);
      this._statusTexts.push(t);
      return t;
    };

    // NPC box — full name, HP only
    st(NPC_BOX.x + 6,   NPC_BOX.y + 5,  npc.name, '6px');
    st(NPC_BOX.x + 6,   NPC_BOX.y + 18, 'HP', '5px', C.S_GREEN);
    st(NPC_BOX.x + 168, NPC_BOX.y + 18, `${npc.hp}/${npc.maxHp}`, '5px', C.S_GREEN);

    // Player box — HP only
    st(PLAY_BOX.x + 6,   PLAY_BOX.y + 5,  'YOU', '7px');
    st(PLAY_BOX.x + 6,   PLAY_BOX.y + 18, 'HP', '5px', C.S_GREEN);
    st(PLAY_BOX.x + 168, PLAY_BOX.y + 18, `${human.hp}/${human.maxHp}`, '5px', C.S_GREEN);
  }

  // ── dialogue box ──────────────────────────────────────────────────────────
  _buildDialogueBox() {
    this.dlgGfx = this.add.graphics().setDepth(8);
    this._drawDlgBox();
    this.dlgText = this.add.text(DLG_TXT_X + 4, DLG_Y + 8, '', {
      fontFamily: FONT, fontSize: '8px', color: C.S_DARK,
      wordWrap: { width: DLG_TXT_W - 8 }, lineSpacing: 6,
    }).setDepth(10);
    this.dlgArrow = this.add.text(DLG_TXT_X + DLG_TXT_W - 12, DLG_Y + DLG_H - 14, '▼', {
      fontFamily: FONT, fontSize: '8px', color: C.S_DARK,
    }).setDepth(10).setVisible(false);
    this.time.addEvent({ delay: 400, loop: true, callback: () => {
      if (this.dlgArrow.visible) this.dlgArrow.setAlpha(this.dlgArrow.alpha === 1 ? 0.2 : 1);
    }});
  }

  _drawDlgBox() {
    const g = this.dlgGfx;
    g.clear();
    drawBox(g, 2, DLG_Y, W - 4, DLG_H, C.WHITE, C.BORDER);
    g.lineStyle(2, C.BORDER, 1);
    g.lineBetween(ACT_X - 2, DLG_Y + 4, ACT_X - 2, DLG_Y + DLG_H - 4);
  }

  // ── action menu ───────────────────────────────────────────────────────────
  _buildActionMenu() {
    this.actGfx  = this.add.graphics().setDepth(9);
    this.actTexts = [];
    for (let i = 0; i < 4; i++) {
      this.actTexts.push(
        this.add.text(ACT_X + 20, DLG_Y + 10 + i * 20, '', {
          fontFamily: FONT, fontSize: '7px', color: C.S_DARK,
        }).setDepth(11).setVisible(false)
      );
    }
    this._actCursor = this.add.text(ACT_X + 6, DLG_Y + 10, '▶', {
      fontFamily: FONT, fontSize: '7px', color: C.S_DARK,
    }).setDepth(12).setVisible(false);
  }

  _showActionMenu(opts) {
    this.uiMode    = 'action';
    this.actionOpts = opts;
    // start cursor on first non-disabled option
    this.actionIdx = opts.findIndex(o => !o.disabled);
    if (this.actionIdx === -1) this.actionIdx = 0;
    this.actTexts.forEach((t, i) => {
      if (i < opts.length) {
        t.setText(opts[i].label)
         .setColor(opts[i].disabled ? C.S_GREY : C.S_DARK)
         .setVisible(true);
      } else {
        t.setVisible(false);
      }
    });
    this._actCursor.setVisible(true);
    this._refreshActionCursor();
  }

  _hideActionMenu() {
    this.actTexts.forEach(t => t.setVisible(false));
    this._actCursor.setVisible(false);
  }

  _refreshActionCursor() {
    this._actCursor.setY(DLG_Y + 10 + this.actionIdx * 20);
  }

  // ── card pick panel ──────────────────────────────────────────────────────
  _buildCardPanel() {
    this.cardPanel = this.add.graphics().setDepth(20).setVisible(false);
    this.cardTexts = [];
    this._cpHeader = this.add.text(W / 2, 8, '', {
      fontFamily: FONT, fontSize: '7px', color: C.S_LIGHT,
    }).setOrigin(0.5, 0).setDepth(22).setVisible(false);
    for (let i = 0; i < this.VISIBLE_CARDS; i++) {
      const row = this.add.text(16, 28 + i * 34, '', {
        fontFamily: FONT, fontSize: '7px', color: C.S_DARK,
        wordWrap: { width: W - 72 },
      }).setDepth(22).setVisible(false);
      const pts = this.add.text(W - 52, 28 + i * 34, '', {
        fontFamily: FONT, fontSize: '7px', color: C.S_DARK,
      }).setDepth(22).setVisible(false);
      const tag = this.add.text(W - 52, 28 + i * 34 + 12, '', {
        fontFamily: FONT, fontSize: '5px', color: C.S_GREEN,
      }).setDepth(22).setVisible(false);
      this.cardTexts.push({ row, pts, tag });
    }
    this._cpHint = this.add.text(W / 2, H - 8, '↑↓ MOVE   Z/ENTER SELECT   X/ESC CANCEL', {
      fontFamily: FONT, fontSize: '5px', color: C.S_GREEN,
    }).setOrigin(0.5, 1).setDepth(22).setVisible(false);
    this._cpCursor = this.add.text(6, 28, '▶', {
      fontFamily: FONT, fontSize: '8px', color: C.S_DARK,
    }).setDepth(23).setVisible(false);
  }

  _showCardPicker(hand, title, onSelect, onCancel) {
    this.uiMode     = 'card-pick';
    this.cardHand   = hand;
    this.cardDone   = onSelect;
    this.cardCancel = onCancel || null;
    this.cardIdx    = 0;
    this.cardScroll = 0;

    const g = this.cardPanel;
    g.clear();
    g.fillStyle(C.WHITE, 1); g.fillRect(0, 0, W, H);
    g.lineStyle(3, C.BORDER, 1); g.strokeRect(2, 2, W - 4, H - 4);
    g.fillStyle(C.BORDER, 1); g.fillRect(0, 0, W, 22);
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
      row.setText(card.title);
      pts.setText(`${card.points}pt`);
      tag.setText(tagLabel(card.tags[0] || '').toUpperCase().slice(0, 10));
    });
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
      card0:  this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '7px', color: C.S_DARK, wordWrap: { width: 110 } }).setDepth(7).setVisible(false),
      pts0:   this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '8px', color: C.S_DARK }).setDepth(7).setVisible(false),
      label1: this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '6px', color: C.S_LIGHT }).setDepth(7).setVisible(false),
      card1:  this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '7px', color: C.S_DARK, wordWrap: { width: 110 } }).setDepth(7).setVisible(false),
      pts1:   this.add.text(0, 0, '', { fontFamily: FONT, fontSize: '8px', color: C.S_DARK }).setDepth(7).setVisible(false),
      vs:     this.add.text(W / 2, 158, 'VS', { fontFamily: FONT, fontSize: '10px', color: C.S_LIGHT }).setOrigin(0.5).setDepth(7).setVisible(false),
    };
  }

  _showPlayedCards() {
    const [human, npc] = this.gs.players;
    const [c0, c1] = this.gs.roundState.primarySelections;
    if (!c0 && !c1) { this._hidePlayedCards(); return; }

    const g = this.playedGfx;
    g.clear();

    if (c0) {
      drawBox(g, 20, 138, 120, 80, C.WHITE, C.BORDER);
      this.playedTexts.label0.setPosition(24, 140).setText(human.name.slice(0, 8)).setVisible(true);
      this.playedTexts.card0.setPosition(24, 154).setText(c0.title).setVisible(true);
      this.playedTexts.pts0.setPosition(24, 196).setText(`${c0.points} pts`).setVisible(true);
    }
    if (c1) {
      drawBox(g, W - 140, 138, 120, 80, C.WHITE, C.BORDER);
      this.playedTexts.label1.setPosition(W - 136, 140).setText(npc.name.slice(0, 8)).setVisible(true);
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
          if (this.dQueue.length || this.dCallback) this.dlgArrow.setVisible(true);
          else this.dlgArrow.setVisible(false);
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
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
  }

  _just(key) { return Phaser.Input.Keyboard.JustDown(this.keys[key]); }
  _confirm() { return this._just('enter') || this._just('z') || this._just('space'); }
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
    if (this._just('up')) {
      let idx = (this.actionIdx - 1 + opts.length) % opts.length;
      let tries = opts.length;
      while (opts[idx]?.disabled && tries-- > 0) idx = (idx - 1 + opts.length) % opts.length;
      this.actionIdx = idx;
      this._refreshActionCursor();
    }
    if (this._just('down')) {
      let idx = (this.actionIdx + 1) % opts.length;
      let tries = opts.length;
      while (opts[idx]?.disabled && tries-- > 0) idx = (idx + 1) % opts.length;
      this.actionIdx = idx;
      this._refreshActionCursor();
    }
    if (this._confirm()) {
      const chosen = opts[this.actionIdx];
      if (!chosen?.disabled) {
        this._hideActionMenu();
        if (chosen?.action) chosen.action();
      }
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
    this.roundLabel.setText(`ROUND ${this.gs.round}`);
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
    const [human] = this.gs.players;
    const opts = [
      { label: 'FIGHT',                          action: () => this._pickCard('primary') },
      { label: `CHALLENGE ${human.challengesLeft}/3`, disabled: true },
      { label: `CALL BS ${human.bullshitLeft}/3`,    disabled: true },
      { label: 'FORFEIT',                         action: () => this._goToMenu() },
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
      lines.push(`${this.gs.players[defWin].name} leads by default!`);
    }

    this.say(lines, () => {
      if (defWin === null) {
        this._doTiebreak();
      } else {
        const opts = [
          { label: 'ACCEPT',                           action: () => this._resolveWith(defWin) },
          { label: `CHALLENGE ${human.challengesLeft}/3`,
            action: human.challengesLeft > 0 ? () => this._dispute('challenge') : null,
            disabled: human.challengesLeft <= 0 },
          { label: `CALL BS ${human.bullshitLeft}/3`,
            action: human.bullshitLeft > 0 ? () => this._dispute('bullshit') : null,
            disabled: human.bullshitLeft <= 0 },
          { label: 'FORFEIT',                          action: () => this._goToMenu() },
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
      resultLine = `Stalemate! No damage dealt.`;
    } else {
      const winner = before.players[winnerIndex];
      const loserIdx = 1 - winnerIndex;
      const loserHp  = this.gs.players[loserIdx].hp;
      resultLine = `${winner.name} deals ${poolPoints} damage! (${loserHp} HP left)`;
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
    if (human.hp > npc.hp)       outcome = `YOU WIN!  ${human.hp}-${npc.hp} HP`;
    else if (npc.hp > human.hp)   outcome = `${npc.name} WINS  ${npc.hp}-${human.hp}`;
    else                          outcome = `DRAW!  ${human.hp}-${npc.hp} HP`;

    this.say(
      ['MATCH OVER!', outcome, 'Thanks for playing.'],
      () => this._showActionMenu([{ label: 'MAIN MENU', action: () => this._goToMenu() }]),
    );
  }

  _goToMenu() {
    this.scene.start('MenuScene');
  }
}
