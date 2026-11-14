import Phaser from 'phaser';
import { BootScene }      from './scenes/BootScene.js';
import { MenuScene }      from './scenes/MenuScene.js';
import { DeckBuildScene } from './scenes/DeckBuildScene.js';
import { BattleScene }    from './scenes/BattleScene.js';

new Phaser.Game({
  type:            Phaser.AUTO,
  width:           480,
  height:          320,
  backgroundColor: '#F8F8F8',
  pixelArt:        true,
  antialias:       false,
  scene:           [BootScene, MenuScene, DeckBuildScene, BattleScene],
  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});
