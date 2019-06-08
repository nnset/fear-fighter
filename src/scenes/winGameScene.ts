import "phaser";
import { MainCharacter } from "../characters/mainCharacter";
import { Score } from '../gameplay/score';

export class WinGameScene extends Phaser.Scene {

    mainTitle: Phaser.GameObjects.Text;
    private score: Score;

    constructor() {
        super({key: "WinGameScene"});
    }

    init(params): void {
        this.score = params.score;
    }

    preload(): void {

    }
    
    create(): void {
        this.add.image(0, 0, 'city').setOrigin(0, 0).setScale(1).setTint(0x333333);

        this.add.text(100, 100, 
            `You have beaten your own fears.`, 
            { font: '24px Courier', fill: '#FBFBAC' }
        );

        this.add.text(100, 150, 
            `Shoots fired: ${this.score.shootsFired}`, 
            { font: '12px Courier', fill: '#FBFBAC' }
        );

        this.add.text(100, 200, 
            `Fears killed: ${this.score.enemiesKilled}`, 
            { font: '12px Courier', fill: '#FBFBAC' }
        );

        this.add.text(100, 250, 
            `Points: ${this.score.points}`, 
            { font: '12px Courier', fill: '#FBFBAC' }
        );
    }

    update(time): void {

    }
};