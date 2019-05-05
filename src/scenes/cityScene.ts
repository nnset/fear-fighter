import "phaser";
import { MainCharacter } from "../characters/mainCharacter";
import { Enemy } from "../characters/enemy";

export class CityScene extends Phaser.Scene {

    mainTitle: Phaser.GameObjects.Text;
    mainCharacter: MainCharacter;
    cursors: Phaser.Input.Keyboard.CursorKeys;
    shootKey: Phaser.Input.Keyboard.Key;
    camera: Phaser.Cameras.Scene2D.Camera;
    enemies: Array<Enemy>;

    constructor() {
        super({key: "CityScene"});        
        this.mainCharacter = new MainCharacter(this, 500, 450, 2);
        this.enemies = new Array<Enemy>();
    }

    init(params): void {

    }

    preload(): void {
        this.load.setBaseURL('http://fearfighter.nnset.com/');
        this.load.image('city', 'assets/Scenes/city.jpg');

        this.mainCharacter.preload();

        new Enemy(this, Enemy.TYPE_BEING_DIFFERENT, 120, 475).preload();
        new Enemy(this, Enemy.TYPE_FEAR_OF_DARK, 120, 475).preload();
        new Enemy(this, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING, 120, 475).preload();
    }
    
    create(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey('X');
        this.add.image(0, 0, 'city').setOrigin(0, 0).setScale(1);

        this.camera = this.cameras.add(0, 0);
        this.camera.setZoom(1.20);
        this.camera.setBounds(
            0, 
            0, 
            parseInt(this.game.config.width.toString()), 
            parseInt(this.game.config.height.toString())
        );

        this.camera.startFollow(this.mainCharacter);

       this.createEnemies(3, Enemy.TYPE_BEING_DIFFERENT);
       this.createEnemies(3, Enemy.TYPE_FEAR_OF_DARK);
       this.createEnemies(3, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING);
       
       this.mainCharacter.create();
    }

    private createEnemies(amount: integer, type: string): void {
        var i:integer = 0;

        while (i < amount) {
            var x:integer = Math.floor(Math.random() * (600 - 80)) + 80;
            var y:integer = Math.floor(Math.random() * (600 - 300)) + 300;
    
            let enemy:Enemy = new Enemy(this, type, x, y, 2);
            enemy.create();

            this.enemies.push(enemy);
            i++;
        }
    }

    update(time, delta): void {
        if (this.shootKey.isDown) {
            this.mainCharacter.shoot();
        } else {
            this.moveMainCharacter();
        }

        this.moveEnemies();
    }

    private moveMainCharacter(): void {
        if (this.anyMovementKeIsPressed()) {
            if (this.cursors.left.isDown) {
                this.mainCharacter.run();
                this.mainCharacter.moveLeft();
            } 
            
            if (this.cursors.right.isDown) {
                this.mainCharacter.run();
                this.mainCharacter.moveRight();
            
            } if (this.cursors.up.isDown) {
                this.mainCharacter.run();
                this.mainCharacter.moveUp();
            } 
            
            if (this.cursors.down.isDown) {
                this.mainCharacter.run();
                this.mainCharacter.moveDown();
            }                 
        } else {
            this.mainCharacter.idle();
        }
    }

    private anyMovementKeIsPressed(): boolean {
        return this.cursors.up.isDown  || this.cursors.down.isDown ||
               this.cursors.left.isDown || this.cursors.right.isDown;
    }

    private moveEnemies(): void {
        for (let enemy of this.enemies) {
            if (enemy.x > parseInt(this.game.config.width.toString()) - 20 || enemy.x < 20) {
                enemy.changeOrientation();
            }

            enemy.move();
        }
    }

};