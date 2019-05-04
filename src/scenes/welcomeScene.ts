import "phaser";
import { MainCharacter } from "../characters/mainCharacter";

export class WelcomeScene extends Phaser.Scene {

    mainTitle: Phaser.GameObjects.Text;
    mainCharacter: MainCharacter;
    cursors: Phaser.Input.Keyboard.CursorKeys;
    shootKey: Phaser.Input.Keyboard.Key;

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
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey('X');

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
    }

    killMainCharacter = () => {
        this.mainCharacter.die();
    }

    shootMainCharacter = () => {
        this.mainCharacter.shoot();
    }

    update(time): void {
        if (this.shootKey.isDown) {
            this.mainCharacter.shoot();
        } else{
            if (this.cursors.left.isDown) {
                this.mainCharacter.run();
            } else if (this.cursors.right.isDown) {
                this.mainCharacter.run();
            } else if (this.cursors.up.isDown) {
                this.mainCharacter.run();
            } else if (this.cursors.down.isDown) {
                this.mainCharacter.run();
            } else {
                this.mainCharacter.idle();
            }    
        }
    }
};