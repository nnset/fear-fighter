import "phaser";
import { WelcomeScene } from "./scenes/welcomeScene";

const config: GameConfig = {
    title: "FearFighter",
    width: 800,
    height: 600,
    parent: "game",
    backgroundColor: "#18216D",
    scene: [WelcomeScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
};

export class FearFighter extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

window.onload = () => {
    var game = new FearFighter(config);
};