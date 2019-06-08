import 'phaser';
import { WelcomeScene } from './scenes/welcomeScene';
import { CityScene } from './scenes/cityScene';
import { WinGameScene } from './scenes/winGameScene';

const renderConfig: RenderConfig = {
    pixelArt: true,
    roundPixels: true
}

const config: GameConfig = {
    title: 'FearFighter',
    width: 1211,
    height: 667,
    parent: 'game',
    backgroundColor: '#18216D',
    zoom: 1,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    render: renderConfig,
    scene: [CityScene, WinGameScene],
    fps: {
        target: 16
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