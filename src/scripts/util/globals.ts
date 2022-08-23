import GridManager from "scripts/game/scenes/Example2/Grid";
import ScoreManager from "scripts/game/scenes/Example2/Score";
import Sound from "scripts/game/Sound";

export const FPS = 10;

export const WIDTH = 854;
export const HEIGHT = 1390;

export const CENTER_X = WIDTH / 2;
export const CENTER_Y = HEIGHT / 2;

export const eventManager = new Phaser.Events.EventEmitter();
export const soundManager = new Sound();

export const dataStorage = {
    bitmaps: {},
};

export const gridManager = new GridManager();
export const scoreManager = new ScoreManager();

export const frames = [
    "2.png",
    "4.png",
    "8.png",
    "16.png",
    "32.png",
    "64.png",
    "128.png",
    "256.png",
    "512.png",
    "1024.png",
];

const token = `${Phaser.Math.Between(0, 1000)}`;
export const rnd = new Phaser.Math.RandomDataGenerator([token]);

export const maxSwipeDuration = 1000;
export const minSwipeDistance = 20;
export const minSwipe = 0.85;
