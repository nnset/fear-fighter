import "phaser";
import { MainCharacter } from "../characters/mainCharacter";

export class WelcomeScene extends Phaser.Scene {

    mainTitle: Phaser.GameObjects.Text;
    mainCharacter: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: "WelcomeScene"
        });
    }

    init(params): void {
        // TODO
    }

    preload(): void {
        this.load.setBaseURL("https://nnset.github.io/fearfighter/");
        this.load.spritesheet('idle', 'assets/MainCharacter/animations/png/idle.png', { frameWidth: 140, frameHeight: 80 });
    }
    
    create(): void {
        const viewportWidth = parseInt(this.game.config.width.toString());
        const viewportHeight = parseInt(this.game.config.height.toString());
        const title = 'Fear Fighter';
        const titleSize = title.length * 7;

        this.mainTitle = this.add.text(
            (viewportWidth/2) - titleSize, 
            viewportHeight/2, 
            title, 
            { font: '24px Courier', fill: '#FBFBAC' }
        );

        this.mainCharacter = this.add.sprite(50, 50, 'idle', 0);       
        this.mainCharacter.anims.load('idle');
        this.mainCharacter.play('idle');
    }


    update(time): void {
        // TODO
    }
};