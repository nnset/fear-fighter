import "phaser";
import { MainCharacter } from "../characters/mainCharacter";
import { Enemy } from "../characters/enemy";
import { GameConfig } from "../gameConfig";

export class WelcomeScene extends Phaser.Scene {

    shootThemSubTitle: Phaser.GameObjects.Text;
    shootThemTitle: Phaser.GameObjects.Text;
    mainCharacter: Phaser.GameObjects.Sprite;
    shootKey: Phaser.Input.Keyboard.Key;
    readyToPlayTimeCounter: number;

    constructor() {
        super({key: "WelcomeScene"});
        this.readyToPlayTimeCounter = 0;
    }

    init(params): void {
        this.cameras.main.setBackgroundColor('#000000');
        this.scene.remove('LoadingScene');
    }

    preload(): void {
        this.load.setBaseURL('http://fearfighter.nnset.com/');
    }
    
    create(): void {
        this.shootKey = this.input.keyboard.addKey('X');

        this.createControls(100, 200);
        this.createMainCharacter(250, 200);
        this.createEnemy(450, 200, Enemy.TYPE_FEAR_OF_DARK, 8);
        this.createEnemy(600, 200, Enemy.TYPE_BEING_DIFFERENT, 8);
        this.createEnemy(750, 200, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING, 8);
        this.createFearBar(0, 20);

        this.createTitles();
    }

    private createControls(x: number, y: number): void {
        let controls = this.add.sprite(x, y, 'controls-anim', 0).setScale(3);

        controls.anims.animationManager.create({
                key: 'controls-anim', 
                frameRate: 2, 
                frames: controls.anims.animationManager.generateFrameNumbers('controls-anim', {}),
                repeat: -1
        });
        controls.anims.load('controls-anim');
        controls.anims.play('controls-anim');

        let buttons = this.add.sprite(x + 50, y, 'shoot-button', 0).setScale(3);

        buttons.anims.animationManager.create({
                key: 'shoot-button', 
                frameRate: 0.5, 
                frames: controls.anims.animationManager.generateFrameNumbers('shoot-button', {}),
                repeat: -1
        });
        buttons.anims.load('shoot-button');
        buttons.anims.play('shoot-button');
    }

    private createMainCharacter(x: number, y: number): void {
        this.mainCharacter = this.add.sprite(x, y, MainCharacter.IDLE, 0).setScale(2);

        this.mainCharacter.anims.animationManager.create({
                key: 'welcome' + MainCharacter.IDLE, 
                frameRate: 8, 
                frames: this.mainCharacter.anims.animationManager.generateFrameNumbers(MainCharacter.IDLE, {}),
                repeat: -1
        });

        this.mainCharacter.anims.animationManager.create({
            key: 'welcome' + MainCharacter.SHOOT, 
            frameRate: 8, 
            frames: this.mainCharacter.anims.animationManager.generateFrameNumbers(MainCharacter.SHOOT, {}),
            repeat: -1
        });

        this.mainCharacter.anims.load('welcome' + MainCharacter.IDLE);
        this.mainCharacter.anims.play('welcome' + MainCharacter.IDLE);
       
        let bubble = this.add.sprite(x - 10, y - 70, 'mainCharacterbubble', 0).setScale(1);

        bubble.anims.animationManager.create({
                key: 'mainCharacterbubble', 
                frameRate: 8, 
                frames: bubble.anims.animationManager.generateFrameNumbers('mainCharacterbubble', {}),
                repeat: 0
        });

        bubble.anims.load('mainCharacterbubble');
        bubble.anims.play('mainCharacterbubble');
    }

    private createEnemy(x: number, y: number, enemyKey: string, frameRate: number): void {
        let enemy = this.add.sprite(x, y, enemyKey+Enemy.IDLE, 0).setScale(2);

        enemy.anims.animationManager.create({
                key: 'welcome' + enemyKey + Enemy.IDLE, 
                frameRate: frameRate, 
                frames: enemy.anims.animationManager.generateFrameNumbers(enemyKey+Enemy.IDLE, {}),
                repeat: -1
        });

        enemy.anims.load('welcome' + enemyKey + Enemy.IDLE);
        enemy.anims.play('welcome' + enemyKey + Enemy.IDLE);

        let bubble = this.add.sprite(x + 10, y - 70, enemyKey + 'bubble', 0).setScale(1);

        bubble.anims.animationManager.create({
                key: enemyKey + 'bubble', 
                frameRate: frameRate, 
                frames: bubble.anims.animationManager.generateFrameNumbers(enemyKey + 'bubble', {}),
                repeat: 0
        });

        bubble.anims.load(enemyKey + 'bubble');
        bubble.anims.play(enemyKey + 'bubble');
    }

    private createFearBar(x: number, y: number): void {
        this.add.image(x, y, 'fear-bar').setScale(1).setOrigin(0, 0);
        
        this.add.text(
            GameConfig.GAME_WIDTH * 0.40, 
            y, 
            'This is your current fear', 
            { font: '18px Courier', fill: '#FBFBAC' }
        );
    }

    private createTitles(): void {
        const title = 'Shoot the hell out of them!';

        this.shootThemTitle = this.add.text(
            0, 
            GameConfig.GAME_HEIGHT/2, 
            title, 
            { font: '64px Courier', fill: '#FBFBAC' }
        );

        this.shootThemTitle.visible = false;

        this.shootThemSubTitle = this.add.text(
            400, 
            GameConfig.GAME_HEIGHT/2 + 80, 
            'Press X to play', 
            { font: '24px Courier', fill: '#FBFBAC' }
        );

        this.shootThemSubTitle.visible = false;
    }

    update(time): void {
        if (this.readyToPlayTimeCounter === 0) {
            this.readyToPlayTimeCounter = time;
        }

        if (time - this.readyToPlayTimeCounter > 3000) {
            this.mainCharacter.anims.load('welcome' + MainCharacter.SHOOT);
            this.mainCharacter.anims.play('welcome' + MainCharacter.SHOOT);
            this.readyToPlayTimeCounter = time;
            this.shootThemTitle.visible = true;
            this.shootThemSubTitle.visible = true;
        }

        if (this.shootKey.isDown) {   
            this.scene.stop('WelcomeScene');
            this.scene.start('CityScene');
        }
    }
};