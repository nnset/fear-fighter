import "phaser";
import { MainCharacter } from "../characters/mainCharacter";

export class WelcomeScene extends Phaser.Scene {

    mainTitle: Phaser.GameObjects.Text;
    mainCharacter: MainCharacter;

    constructor() {
        super({
            key: "WelcomeScene"
        });
        
        this.mainCharacter = new MainCharacter(this, 150, 200, 2);
    }

    init(params): void {
        
    }

    preload(): void {
        this.load.setBaseURL('http://fearfighter.nnset.com/');
        this.mainCharacter.preload();
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

        this.mainCharacter.create();

        this.time.addEvent({
            delay: 3000,
            callback: this.shootMainCharacter,
            repeat: 3
        });

        this.time.addEvent({
            delay: 10000,
            callback: this.killMainCharacter
        });
    }

    killMainCharacter = () => {
        this.mainCharacter.die();
    }

    shootMainCharacter = () => {
        this.mainCharacter.shoot();
    }

    update(time): void {
        // TODO
    }
};