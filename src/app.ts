import 'phaser';
import { WelcomeScene } from './scenes/welcomeScene';
import { CityScene } from './scenes/cityScene';
import { WinGameScene } from './scenes/winGameScene';
import { LoadingScene } from './scenes/loadingScene';
import { GameConfig } from './gameConfig';

const renderConfig: RenderConfig = {
    pixelArt: true,
    roundPixels: true
}

const config: GameConfig = {
    title: GameConfig.GAME_TITLE,
    width: GameConfig.GAME_WIDTH,
    height: GameConfig.GAME_HEIGHT,
    parent: 'game',
    backgroundColor: GameConfig.BACKGROUND_COLOR,
    zoom: 1,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    render: renderConfig,
    scene: [LoadingScene, WelcomeScene, CityScene, WinGameScene],
    fps: {
        target: GameConfig.GAME_FPS
    }
};

export class FearFighter extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

window.onload = () => {
    var game = new FearFighter(config);
};