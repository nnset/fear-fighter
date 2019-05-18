import 'phaser';
import { Score } from '../gameplay/score';

export class HUD extends Phaser.GameObjects.Container {

    public fearBar: Phaser.GameObjects.Image;
    public bulletIcon: Phaser.GameObjects.Image;
    public shootsCounter: Phaser.GameObjects.Text;
    public scoreCounter: Phaser.GameObjects.Text;
    public backgroundArea: Phaser.GameObjects.Rectangle;
   
    private score: Score;
    
    constructor(scene: Phaser.Scene, x: number, y: number, score: Score) {
        super(scene, x, y);
        this.score = score;
    }

    preload(): void {
        this.scene.load.image('fear-bar', 'assets/Ui/fear-bar.jpg');
    }

    create(): void {
        this.backgroundArea = this.scene.add.rectangle(this.x, this.y, 1200, 55, 0x000000, 0.65).setOrigin(0, 0);
        this.fearBar = this.scene.add.image(this.x, this.y, 'fear-bar').setScale(0.75);
        this.bulletIcon = this.scene.add.image(this.x, this.y, 'bullet');
        this.shootsCounter = this.scene.add.text(this.x, this.y, this.score.shootsFired.toString());
        this.scoreCounter = this.scene.add.text(this.x, this.y, this.score.points.toString()).setFontSize(32);
        
        this.fearBar.setOrigin(0 ,0);
        
        this.add(this.backgroundArea);
        this.add(this.fearBar);
        this.add(this.bulletIcon);
        this.add(this.shootsCounter);
        this.add(this.scoreCounter);
    }

    update(x: number, y: number): void {
        // TODO Remove all these magic numbers
        let baseY = y + 5;

        this.backgroundArea.setPosition(x, y);

        this.fearBar.setPosition(x, baseY);
        this.fearBar.setCrop(0, 0, this.fearBar.width * this.score.fearProgress(), this.fearBar.height);
        
        this.bulletIcon.setPosition(x + this.bulletIcon.width, baseY + this.fearBar.height + 5);

        this.shootsCounter.setText(this.score.shootsFired.toString());
        this.shootsCounter.setPosition(x + this.bulletIcon.width + 40, baseY + this.fearBar.height - 5);

        this.scoreCounter.setText(this.pad(this.score.points, 6));
        this.scoreCounter.setPosition(x + 500, baseY + this.fearBar.height - 5);
    }

    private pad(num:number, size:number): string {
        // TODO : Use ECMAScript 2017 (ECMA-262) String.padStart instead of this function.
        let numberWithPadding = num + "";
        
        while (numberWithPadding.length < size) {
            numberWithPadding = "0" + numberWithPadding;
        } 
        
        return numberWithPadding;
    }
}