// js/main.js

import { config } from './gameConfig.js';
import { MainScene } from './sceneMain.js';

// Asigna la MainScene a la configuración del juego
config.scene = MainScene;

// Inicia el juego Phaser
let game = new Phaser.Game(config);