import "phaser";
import { GameConfig } from '../gameConfig';
import { Enemy } from '../characters/enemy';
import { MainCharacter } from '../characters/mainCharacter';

export class LoadingScene extends Phaser.Scene {

    private isLoadingComplete: boolean = false;
    private shootKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({key: "LoadingScene"});
    }

    init(params): void {
        this.cameras.main.setBackgroundColor('#000000');
    }

    preload(): void {
        document.getElementById('game-spinner').remove();

        this.createProgressBar();

        this.input.keyboard.enabled = true;
        this.shootKey = this.input.keyboard.addKey('X');

        this.load.setBaseURL('http://fearfighter.nnset.com/');
        this.load.image('city', 'assets/Scenes/city.jpg');
        this.load.image('bullet', 'assets/Objects/bullet.png');
        this.load.image('bullet-left', 'assets/Objects/bullet-left.png');
        this.load.image('fear-bar', 'assets/Ui/fear-bar.jpg');
        
        this.load.spritesheet(Enemy.TYPE_BEING_DIFFERENT + 'bubble', 'assets/Enemies/BeingDifferent/bubble.png', {frameWidth: 144, frameHeight: 56});
        this.load.spritesheet(Enemy.TYPE_FEAR_OF_DARK + 'bubble', 'assets/Enemies/FearOfDark/bubble.png', {frameWidth: 96, frameHeight: 56});
        this.load.spritesheet(Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING + 'bubble', 'assets/Enemies/FearOfPublicSpeaking/bubble.png', {frameWidth: 144, frameHeight: 56});
        this.load.spritesheet('mainCharacterbubble', 'assets/MainCharacter/bubble.png', {frameWidth: 144, frameHeight: 56});
        
        // https://retrocademedia.itch.io/controller-pack
        this.load.spritesheet('controls-anim', 'assets/Ui/cursors.png', {frameWidth: 20, frameHeight: 19});
        this.load.spritesheet('shoot-button', 'assets/Ui/button.png', {frameWidth: 10, frameHeight: 10});

        new Enemy(this, Enemy.TYPE_FEAR_OF_DARK, 0, 0).preload();
        new Enemy(this, Enemy.TYPE_BEING_DIFFERENT, 0, 0).preload();
        new Enemy(this, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING, 0, 0).preload();

        new MainCharacter(this, 0, 0, 2).preload(); 
    }

    private createProgressBar(): void {
        let width = GameConfig.GAME_WIDTH * 0.75 ;
        let height = 50;
        let xStart = width / 8;
        let yStart = (GameConfig.GAME_HEIGHT / 2) - height;
        let borderOffset = 2;
        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset,
            yStart - borderOffset,
            width + borderOffset * 2,
            height + borderOffset * 2);

        let border = this.add.graphics({
            lineStyle: {
                width: 5,
                color: 0xaaaaaa
            }
        });
        border.strokeRectShape(borderRect);

        let progressbar = this.add.graphics();

        let updateProgressbar = function (percentage: number){
            progressbar.clear();
            progressbar.fillStyle(0xffffff, 1);
            progressbar.fillRect(xStart, yStart, percentage * width, height);
        };

        this.load.on('progress', updateProgressbar);

        this.load.once('complete', function (){
            this.load.off('progress', updateProgressbar);
            this.isLoadingComplete = true;
        }, this);
    }
    
    create(): void {

    }

    update(time): void {
        if (this.isLoadingComplete) {
            this.input.keyboard.removeKey('X');
            this.shootKey.removeAllListeners();
            this.scene.stop('LoadingScene');
            this.scene.start('WelcomeScene');
        }
    }
};