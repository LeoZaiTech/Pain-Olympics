import { CARD_POOL, SETTINGS, tagLabel } from '../shared/data.js';
import { shuffle } from '../shared/gameEngine.js';

const FONT   = '"Press Start 2P", monospace';
const W = 480, H = 320;
const DECK_SIZE = SETTINGS.soloDeckSize; // 40

// Layout
const HDR_H  = 24;   // header bar height
const ROW_H  = 37;   // card row height
const ROWS   = 7;    // visible rows
const LIST_Y = HDR_H;
const LIST_H = ROWS * ROW_H;  // 259
const FTR_Y  = LIST_Y + LIST_H; // 283
const FTR_H  = H - FTR_Y;      // 37

// Palette (matches BattleScene light aesthetic)
const C = {
  BG:      0xF8F8F8,
  HEADER:  0x202020,
  BORDER:  0x202020,
  ROW_ODD: 0xF0F4E8,
  ROW_EVN: 0xF8F8F8,
  SEL_BG:  0xD0ECC0,
  CUR_BG:  0x9BBC0F,
  FTR_BG:  0x202020,
  GREEN:   0x306230,
  MID:     0x8BAC0F,
  S_DARK:  '#202020',
  S_WHITE: '#F8F8F8',
  S_GREEN: '#306230',
  S_LIGHT: '#9BBC0F',
  S_GREY:  '#888888',
  S_SEL:   '#186018',
};

export class DeckBuildScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DeckBuildScene' });
    this.cards       = [];     // all CARD_POOL cards
    this.selected    = new Set(); // selected card ids
    this.cursorIdx   = 0;      // absolute index in total items list
    this.scrollTop   = 0;      // first visible row index
    this.totalItems  = 0;      // cards.length + 3 action items

    // action item indices (set in create)
    this.ACTION_AUTOFILL = 0;
    this.ACTION_CLEAR    = 1;
    this.ACTION_BATTLE   = 2;

    // UI refs
    this.bgGfx       = null;
    this.rowGfx      = null;
    this.rowTexts    = [];     // [{check, title, pts, tag}]
    this.hdrText     = null;
    this.counterText = null;
    this.ftrHint     = null;
    this.keys        = null;
  }

  create() {
    this.cards      = [...CARD_POOL];
    this.selected   = new Set();
    this.cursorIdx  = 0;
    this.scrollTop  = 0;
    this.totalItems = this.cards.length + 3; // +3 action rows
    this.ACTION_AUTOFILL = this.cards.length;
    this.ACTION_CLEAR    = this.cards.length + 1;
    this.ACTION_BATTLE   = this.cards.length + 2;
    this._inputReady = false; // brief cooldown to prevent input leak from previous scene

    this._buildUI();
    this._setupKeys();
    this._refresh();

    // Enable input after 2 frames to absorb any carried-over key presses
    this.time.delayedCall(80, () => { this._inputReady = true; });
  }

  update() {
    if (this._inputReady) this._handleInput();
  }

  // ── UI construction ────────────────────────────────────────────────────────
  _buildUI() {
    // Background
    this.bgGfx = this.add.graphics().setDepth(0);
    this.bgGfx.fillStyle(C.BG, 1);
    this.bgGfx.fillRect(0, 0, W, H);

    // Header bar
    this.bgGfx.fillStyle(C.HEADER, 1);
    this.bgGfx.fillRect(0, 0, W, HDR_H);

    // Footer bar
    this.bgGfx.fillStyle(C.FTR_BG, 1);
    this.bgGfx.fillRect(0, FTR_Y, W, FTR_H);

    // Header text
    this.hdrText = this.add.text(12, HDR_H / 2, 'BUILD YOUR DECK', {
      fontFamily: FONT, fontSize: '7px', color: C.S_LIGHT,
    }).setOrigin(0, 0.5).setDepth(2);

    this.counterText = this.add.text(W - 12, HDR_H / 2, `0/${DECK_SIZE}`, {
      fontFamily: FONT, fontSize: '7px', color: C.S_WHITE,
    }).setOrigin(1, 0.5).setDepth(2);

    // Footer hint
    this.ftrHint = this.add.text(W / 2, FTR_Y + FTR_H / 2, '↑↓ MOVE   Z/ENTER TOGGLE   X BACK', {
      fontFamily: FONT, fontSize: '5px', color: C.S_GREY,
    }).setOrigin(0.5, 0.5).setDepth(2);

    // Row graphics + text objects
    this.rowGfx = this.add.graphics().setDepth(1);
    this.rowTexts = [];
    for (let i = 0; i < ROWS; i++) {
      const y = LIST_Y + i * ROW_H;
      const check = this.add.text(10, y + ROW_H / 2, '□', {
        fontFamily: FONT, fontSize: '8px', color: C.S_DARK,
      }).setOrigin(0, 0.5).setDepth(3);
      const title = this.add.text(30, y + ROW_H / 2 - 5, '', {
        fontFamily: FONT, fontSize: '6px', color: C.S_DARK,
      }).setOrigin(0, 0.5).setDepth(3);
      const pts = this.add.text(W - 100, y + ROW_H / 2 - 5, '', {
        fontFamily: FONT, fontSize: '6px', color: C.S_GREEN,
      }).setOrigin(0, 0.5).setDepth(3);
      const tag = this.add.text(W - 100, y + ROW_H / 2 + 6, '', {
        fontFamily: FONT, fontSize: '5px', color: C.S_GREY,
      }).setOrigin(0, 0.5).setDepth(3);
      this.rowTexts.push({ check, title, pts, tag });
    }
  }

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

  // ── input ──────────────────────────────────────────────────────────────────
  _handleInput() {
    if (this._just('up')) {
      if (this.cursorIdx > 0) {
        this.cursorIdx--;
        if (this.cursorIdx < this.scrollTop) this.scrollTop--;
        this._refresh();
      }
    }
    if (this._just('down')) {
      if (this.cursorIdx < this.totalItems - 1) {
        this.cursorIdx++;
        if (this.cursorIdx >= this.scrollTop + ROWS) this.scrollTop++;
        this._refresh();
      }
    }
    if (this._just('enter') || this._just('z') || this._just('space')) {
      this._activate();
    }
    if (this._just('esc') || this._just('x')) {
      this.scene.start('MenuScene');
    }
  }

  _activate() {
    const idx = this.cursorIdx;
    if (idx < this.cards.length) {
      // toggle card
      const card = this.cards[idx];
      if (this.selected.has(card.id)) {
        this.selected.delete(card.id);
      } else if (this.selected.size < DECK_SIZE) {
        this.selected.add(card.id);
      }
      this._refresh();
    } else if (idx === this.ACTION_AUTOFILL) {
      this._doAutoFill();
    } else if (idx === this.ACTION_CLEAR) {
      this.selected.clear();
      this._refresh();
    } else if (idx === this.ACTION_BATTLE) {
      this._startBattle();
    }
  }

  _doAutoFill() {
    const remaining = DECK_SIZE - this.selected.size;
    if (remaining <= 0) return;
    const unselected = this.cards.filter(c => !this.selected.has(c.id));
    shuffle(unselected).slice(0, remaining).forEach(c => this.selected.add(c.id));
    this._refresh();
  }

  _startBattle() {
    if (this.selected.size === 0) {
      // auto-fill everything if nothing selected
      this._doAutoFill();
    }
    if (this.selected.size < DECK_SIZE) {
      this._doAutoFill();
    }
    const playerDeck = this.cards.filter(c => this.selected.has(c.id)).slice(0, DECK_SIZE);
    this.scene.start('BattleScene', { playerDeck });
  }

  // ── rendering ─────────────────────────────────────────────────────────────
  _refresh() {
    this.counterText.setText(`${this.selected.size}/${DECK_SIZE}`);
    this.counterText.setColor(
      this.selected.size >= DECK_SIZE ? '#40C840' :
      this.selected.size > 0         ? C.S_LIGHT  : C.S_WHITE
    );

    this.rowGfx.clear();
    const visible = this.totalItems - this.scrollTop;
    const rowCount = Math.min(ROWS, visible);

    for (let i = 0; i < ROWS; i++) {
      const absIdx = this.scrollTop + i;
      const y = LIST_Y + i * ROW_H;
      const { check, title, pts, tag } = this.rowTexts[i];

      if (absIdx >= this.totalItems) {
        // blank row
        this.rowGfx.fillStyle(C.BG, 1);
        this.rowGfx.fillRect(0, y, W, ROW_H);
        check.setText(''); title.setText(''); pts.setText(''); tag.setText('');
        continue;
      }

      const isCursor = absIdx === this.cursorIdx;

      if (absIdx < this.cards.length) {
        // card row
        const card = this.cards[absIdx];
        const isSel = this.selected.has(card.id);

        // Row background
        const rowBg = isCursor ? C.CUR_BG : isSel ? C.SEL_BG : (i % 2 === 0 ? C.ROW_EVN : C.ROW_ODD);
        this.rowGfx.fillStyle(rowBg, 1);
        this.rowGfx.fillRect(0, y, W, ROW_H);
        // Row divider
        this.rowGfx.lineStyle(1, C.MID, 0.3);
        this.rowGfx.lineBetween(0, y + ROW_H - 1, W, y + ROW_H - 1);

        const textCol = isCursor ? C.S_WHITE : isSel ? C.S_SEL : C.S_DARK;
        check.setY(y + ROW_H / 2).setText(isSel ? '✓' : '□').setColor(isCursor ? C.S_WHITE : isSel ? '#40C840' : C.S_GREY);
        const maxLen = 32;
        const cardTitle = card.title.length > maxLen ? card.title.slice(0, maxLen) + '…' : card.title;
        title.setY(y + ROW_H / 2 - 5).setText(cardTitle).setColor(textCol);
        pts.setY(y + ROW_H / 2 - 5).setText(`${card.points}pt`).setColor(isCursor ? '#A0F0A0' : C.S_GREEN);
        tag.setY(y + ROW_H / 2 + 6).setText(tagLabel(card.tags[0] || '').toUpperCase().slice(0, 10)).setColor(isCursor ? '#C0E0C0' : C.S_GREY);

      } else {
        // action row
        const actionIdx = absIdx - this.cards.length;
        const labels = ['▸ AUTO-FILL', '▸ CLEAR ALL', '▸ START BATTLE'];
        const actionLabel = labels[actionIdx] || '';

        this.rowGfx.fillStyle(isCursor ? C.GREEN : C.BG, 1);
        this.rowGfx.fillRect(0, y, W, ROW_H);
        this.rowGfx.lineStyle(1, C.GREEN, 0.5);
        this.rowGfx.lineBetween(0, y + ROW_H - 1, W, y + ROW_H - 1);

        const aColor = isCursor ? C.S_WHITE : (actionIdx === 2 && this.selected.size === 0 ? C.S_GREY : C.S_GREEN);
        check.setY(y + ROW_H / 2).setText('').setColor(C.S_DARK);
        title.setY(y + ROW_H / 2).setText(actionLabel).setColor(aColor);
        pts.setText(''); tag.setText('');
      }
    }

    // Scrollbar indicator
    if (this.totalItems > ROWS) {
      const barH = Math.max(10, Math.floor((ROWS / this.totalItems) * LIST_H));
      const barY = LIST_Y + Math.floor((this.scrollTop / (this.totalItems - ROWS)) * (LIST_H - barH));
      this.rowGfx.fillStyle(C.MID, 0.5);
      this.rowGfx.fillRect(W - 5, barY, 4, barH);
    }
  }
}
