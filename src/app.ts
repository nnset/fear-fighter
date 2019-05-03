import "phaser";
import { WelcomeScene } from "./scenes/welcomeScene";

const renderConfig: RenderConfig = {
    pixelArt: true,
    roundPixels: true
}

const config: GameConfig = {
    title: "FearFighter",
    width: 800,
    height: 600,
    parent: "game",
    backgroundColor: "#18216D",
    zoom: 1,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    render: renderConfig,
    scene: [WelcomeScene]    
};

export class FearFighter extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

window.onload = () => {
    var game = new FearFighter(config);
};