import Phaser, { Game } from 'phaser';

import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 768,
  height: 576,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [BootScene, GameScene],
};

export default new Phaser.Game(config);
