export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.load.json('npc-decks',    './data/npc-decks.json');
    this.load.json('npc-dialogue', './data/npc-dialogue.json');
    this.load.image('karen',       './assets/walmart-karen.png');

    // loading bar
    const { width: W, height: H } = this.scale;
    const bar = this.add.graphics();
    this.load.on('progress', v => {
      bar.clear();
      bar.fillStyle(0x0F380F, 1); bar.fillRect(0, 0, W, H);
      bar.fillStyle(0x9BBC0F, 1); bar.fillRect(W/2 - 80, H/2 - 6, 160 * v, 12);
      bar.lineStyle(2, 0x9BBC0F, 1); bar.strokeRect(W/2 - 80, H/2 - 6, 160, 12);
    });
  }

  create() {
    document.fonts.ready.then(() => this.scene.start('MenuScene'));
  }
}
