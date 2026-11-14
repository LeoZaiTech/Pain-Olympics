const GB = { DARKEST: 0x0F380F, DARK: 0x306230, MID: 0x8BAC0F, LIGHT: 0x9BBC0F };
const FONT = '"Press Start 2P", monospace';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const { width: W, height: H } = this.scale;

    // Sky gradient layers
    this.add.rectangle(0, 0, W, H * 0.55, GB.LIGHT).setOrigin(0, 0);
    this.add.rectangle(0, H * 0.55, W, H * 0.45, GB.DARKEST).setOrigin(0, 0);

    // Horizontal platform line
    this.add.rectangle(0, H * 0.55, W, 4, GB.DARKEST).setOrigin(0, 0);

    // Title box
    const bx = 24, by = 28, bw = W - 48, bh = 80;
    const g = this.add.graphics();
    g.fillStyle(GB.DARKEST, 1); g.fillRect(bx, by, bw, bh);
    g.lineStyle(4, GB.LIGHT, 1); g.strokeRect(bx, by, bw, bh);

    this.add.text(W / 2, by + 20, 'PAIN', {
      fontFamily: FONT, fontSize: '22px', color: '#9BBC0F',
    }).setOrigin(0.5, 0);

    this.add.text(W / 2, by + 46, 'OLYMPICS', {
      fontFamily: FONT, fontSize: '22px', color: '#9BBC0F',
    }).setOrigin(0.5, 0);

    // Subtitle
    this.add.text(W / 2, by + bh + 14, 'BATTLE EDITION', {
      fontFamily: FONT, fontSize: '7px', color: '#306230',
    }).setOrigin(0.5, 0);

    // Blinking PRESS ENTER
    const pressEnter = this.add.text(W / 2, H * 0.55 + 28, 'PRESS  ENTER  TO  START', {
      fontFamily: FONT, fontSize: '8px', color: '#9BBC0F',
    }).setOrigin(0.5, 0);

    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => pressEnter.setVisible(!pressEnter.visible),
    });

    // Flavour
    this.add.text(W / 2, H - 22, 'gallows humor  not cruelty', {
      fontFamily: FONT, fontSize: '6px', color: '#306230',
    }).setOrigin(0.5, 0);

    // Input
    const enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const z     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    const space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const go = () => this.scene.start('DeckBuildScene');
    enter.once('down', go);
    z.once('down', go);
    space.once('down', go);
  }
}
