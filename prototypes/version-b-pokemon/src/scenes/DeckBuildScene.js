import { CARD_POOL, EXPANSION_PACKS, SETTINGS, tagLabel } from '../shared/data.js';
import { shuffle } from '../shared/gameEngine.js';

const FONT   = '"Press Start 2P", monospace';
const W = 480, H = 320;
const DECK_SIZE = SETTINGS.soloDeckSize; // 40

// Layout
const HDR_H  = 24;   // header bar height
const TAB_H  = 18;   // tab strip height
const ROW_H  = 37;   // card row height
const ROWS   = 6;    // visible rows (reduced by 1 to make room for tab strip)
const LIST_Y = HDR_H + TAB_H;
const LIST_H = ROWS * ROW_H;  // 222
const FTR_Y  = LIST_Y + LIST_H; // 264
const FTR_H  = H - FTR_Y;      // 56

// Palette (matches BattleScene light aesthetic)
const C = {
  BG:       0xF8F8F8,
  HEADER:   0x202020,
  BORDER:   0x202020,
  ROW_ODD:  0xF0F4E8,
  ROW_EVN:  0xF8F8F8,
  SEL_BG:   0xD0ECC0,
  CUR_BG:   0x9BBC0F,
  FTR_BG:   0x202020,
  TAB_ACT:  0x306230,
  TAB_INA:  0x505850,
  GREEN:    0x306230,
  MID:      0x8BAC0F,
  S_DARK:   '#202020',
  S_WHITE:  '#F8F8F8',
  S_GREEN:  '#306230',
  S_LIGHT:  '#9BBC0F',
  S_GREY:   '#888888',
  S_SEL:    '#186018',
  S_GOLD:   '#C8A800',
};

export class DeckBuildScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DeckBuildScene' });
    // tab data — populated in create()
    this.tabCards    = [];   // [[...mainCards], [...expansionCards], ...]
    this.tabNames    = [];   // display names per tab
    this.activeTab   = 0;

    // current view
    this.cards       = [];   // tabCards[activeTab]
    this.selected    = new Set(); // selected card ids (shared across tabs)
    this.cursorIdx   = 0;
    this.scrollTop   = 0;
    this.totalItems  = 0;    // cards.length + 3 action items

    this.ACTION_AUTOFILL = 0;
    this.ACTION_CLEAR    = 1;
    this.ACTION_BATTLE   = 2;

    // UI refs
    this.bgGfx       = null;
    this.tabGfx      = null;
    this.rowGfx      = null;
    this.rowTexts    = [];
    this.hdrText     = null;
    this.tabTexts    = [];
    this.counterText = null;
    this.ftrHint     = null;
    this.keys        = null;

    // hold-to-scroll state
    this._heldDir    = 0;
    this._holdStart  = 0;
    this._lastRepeat = 0;
    this._HOLD_DELAY = 320;
    this._HOLD_RPT   = 65;
    this._inputReady = false;
  }

  create() {
    // Build tab data
    this.tabCards = [
      [...CARD_POOL],
      ...EXPANSION_PACKS.map(p => [...p.cards]),
    ];
    this.tabNames = [
      'MAIN POOL',
      ...EXPANSION_PACKS.map(p => (p.tabLabel || p.name).toUpperCase()),
    ];
    this.selected  = new Set();
    this.activeTab = 0;
    this._applyTab(0, false);

    this._buildUI();
    this._setupKeys();
    this._refresh();

    this._inputReady = false;
    this.time.delayedCall(80, () => { this._inputReady = true; });
  }

  update() {
    if (this._inputReady) this._handleInput();
  }

  // ── tab management ────────────────────────────────────────────────────────
  _applyTab(tabIdx, doRefresh = true) {
    this.activeTab   = tabIdx;
    this.cards       = this.tabCards[tabIdx];
    this.totalItems  = this.cards.length + 3;
    this.ACTION_AUTOFILL = this.cards.length;
    this.ACTION_CLEAR    = this.cards.length + 1;
    this.ACTION_BATTLE   = this.cards.length + 2;
    this.cursorIdx   = 0;
    this.scrollTop   = 0;
    if (doRefresh) this._refresh();
  }

  _switchTab(dir) {
    const next = this.activeTab + dir;
    if (next < 0 || next >= this.tabCards.length) return;
    this._applyTab(next);
  }

  // ── UI construction ───────────────────────────────────────────────────────
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

    // Tab strip (drawn dynamically in _refresh, but create text objects now)
    this.tabGfx = this.add.graphics().setDepth(1);
    this.tabTexts = this.tabNames.map((name, i) => {
      return this.add.text(0, HDR_H + TAB_H / 2, '', {
        fontFamily: FONT, fontSize: '5px', color: C.S_WHITE,
      }).setOrigin(0, 0.5).setDepth(3);
    });

    // Footer hints (two lines)
    this.ftrHint = this.add.text(W / 2, FTR_Y + FTR_H * 0.33, '↑↓ MOVE   Z/ENTER TOGGLE   X BACK', {
      fontFamily: FONT, fontSize: '5px', color: C.S_GREY,
    }).setOrigin(0.5, 0.5).setDepth(2);

    this.ftrHint2 = this.add.text(W / 2, FTR_Y + FTR_H * 0.67, '◄► SWITCH POOL', {
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
      left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      z:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      x:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      esc:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
  }

  _just(key) { return Phaser.Input.Keyboard.JustDown(this.keys[key]); }

  // ── input ─────────────────────────────────────────────────────────────────
  _handleInput() {
    const now = this.time.now;
    const upHeld   = this.keys.up.isDown;
    const downHeld = this.keys.down.isDown;

    // Tab switch — LEFT / RIGHT
    if (this._just('left'))  { this._switchTab(-1); return; }
    if (this._just('right')) { this._switchTab(1);  return; }

    // First-press via JustDown
    if (this._just('up')) {
      this._moveCursor(-1);
      this._heldDir    = -1;
      this._holdStart  = now;
      this._lastRepeat = now;
    } else if (this._just('down')) {
      this._moveCursor(1);
      this._heldDir    = 1;
      this._holdStart  = now;
      this._lastRepeat = now;
    } else if (!upHeld && !downHeld) {
      this._heldDir = 0;
    }

    // Hold repeat
    if (this._heldDir !== 0) {
      const stillHeld = this._heldDir === -1 ? upHeld : downHeld;
      if (stillHeld &&
          now - this._holdStart  > this._HOLD_DELAY &&
          now - this._lastRepeat > this._HOLD_RPT) {
        this._moveCursor(this._heldDir);
        this._lastRepeat = now;
      }
    }

    if (this._just('enter') || this._just('z') || this._just('space')) {
      this._activate();
    }
    if (this._just('esc') || this._just('x')) {
      this.scene.start('MenuScene');
    }
  }

  _moveCursor(dir) {
    const next = this.cursorIdx + dir;
    if (next < 0 || next >= this.totalItems) return;
    this.cursorIdx = next;
    if (this.cursorIdx < this.scrollTop) this.scrollTop = this.cursorIdx;
    if (this.cursorIdx >= this.scrollTop + ROWS) this.scrollTop = this.cursorIdx - ROWS + 1;
    this._refresh();
  }

  _activate() {
    const idx = this.cursorIdx;
    if (idx < this.cards.length) {
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
    // Fill from all pools combined, current tab first
    const otherCards = this.tabCards
      .filter((_, i) => i !== this.activeTab)
      .flat();
    const pool = [...this.cards, ...otherCards];
    const unselected = pool.filter(c => !this.selected.has(c.id));
    // dedupe by id (dual-listed cards appear in both pools)
    const seen = new Set();
    const unique = unselected.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
    shuffle(unique).slice(0, remaining).forEach(c => this.selected.add(c.id));
    this._refresh();
  }

  _startBattle() {
    if (this.selected.size < DECK_SIZE) {
      this._doAutoFill();
    }
    // Collect card objects for all selected ids, deduped
    const allCards = this.tabCards.flat();
    const seen = new Set();
    const playerDeck = allCards
      .filter(c => {
        if (!this.selected.has(c.id) || seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      })
      .slice(0, DECK_SIZE);
    this.scene.start('BattleScene', { playerDeck });
  }

  // ── rendering ────────────────────────────────────────────────────────────
  _refresh() {
    // Counter (total selected across all tabs)
    this.counterText.setText(`${this.selected.size}/${DECK_SIZE}`);
    this.counterText.setColor(
      this.selected.size >= DECK_SIZE ? '#40C840' :
      this.selected.size > 0         ? C.S_LIGHT  : C.S_WHITE
    );

    // Tab strip
    this.tabGfx.clear();
    this.tabGfx.fillStyle(0x383838, 1);
    this.tabGfx.fillRect(0, HDR_H, W, TAB_H);

    const tabW = Math.floor(W / this.tabCards.length);
    this.tabTexts.forEach((txt, i) => {
      const isActive = i === this.activeTab;
      const tx = i * tabW;
      // Active tab highlight
      this.tabGfx.fillStyle(isActive ? C.TAB_ACT : C.TAB_INA, 1);
      this.tabGfx.fillRect(tx, HDR_H, tabW - 1, TAB_H);
      // Selected-count badge for non-active tabs
      const tabSel = this.tabCards[i].filter(c => this.selected.has(c.id)).length;
      const label  = `${this.tabNames[i]}` + (tabSel > 0 && !isActive ? ` [${tabSel}]` : '');
      txt.setX(tx + 6).setText(label);
      txt.setColor(isActive ? C.S_LIGHT : C.S_GREY);
    });

    // Card list rows
    this.rowGfx.clear();

    for (let i = 0; i < ROWS; i++) {
      const absIdx = this.scrollTop + i;
      const y = LIST_Y + i * ROW_H;
      const { check, title, pts, tag } = this.rowTexts[i];

      if (absIdx >= this.totalItems) {
        this.rowGfx.fillStyle(C.BG, 1);
        this.rowGfx.fillRect(0, y, W, ROW_H);
        check.setText(''); title.setText(''); pts.setText(''); tag.setText('');
        continue;
      }

      const isCursor = absIdx === this.cursorIdx;

      if (absIdx < this.cards.length) {
        // card row
        const card   = this.cards[absIdx];
        const isSel  = this.selected.has(card.id);
        // Is this card dual-listed (appears in main pool AND expansion)?
        const isDual = this.activeTab > 0 && CARD_POOL.some(c => c.id === card.id);

        const rowBg = isCursor ? C.CUR_BG : isSel ? C.SEL_BG : (i % 2 === 0 ? C.ROW_EVN : C.ROW_ODD);
        this.rowGfx.fillStyle(rowBg, 1);
        this.rowGfx.fillRect(0, y, W, ROW_H);
        this.rowGfx.lineStyle(1, C.MID, 0.3);
        this.rowGfx.lineBetween(0, y + ROW_H - 1, W, y + ROW_H - 1);

        const textCol = isCursor ? C.S_WHITE : isSel ? C.S_SEL : C.S_DARK;
        check.setY(y + ROW_H / 2).setText(isSel ? '✓' : '□').setColor(isCursor ? C.S_WHITE : isSel ? '#40C840' : C.S_GREY);
        title.setY(y + ROW_H / 2 - 5).setText(card.title).setColor(textCol);
        pts.setY(y + ROW_H / 2 - 5).setText(`${card.points}pt`).setColor(isCursor ? '#A0F0A0' : C.S_GREEN);

        // Tag line — mark dual-listed cards with ★ ALSO IN MAIN
        const tagStr = isDual
          ? '★ ALSO IN MAIN'
          : tagLabel(card.tags[0] || '').toUpperCase().slice(0, 10);
        const tagCol = isDual
          ? (isCursor ? '#FFD060' : C.S_GOLD)
          : (isCursor ? '#C0E0C0' : C.S_GREY);
        tag.setY(y + ROW_H / 2 + 6).setText(tagStr).setColor(tagCol);

      } else {
        // action row
        const actionIdx   = absIdx - this.cards.length;
        const labels      = ['▸ AUTO-FILL', '▸ CLEAR ALL', '▸ START BATTLE'];
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
