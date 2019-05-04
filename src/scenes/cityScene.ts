import "phaser";
import { MainCharacter } from "../characters/mainCharacter";

export class CityScene extends Phaser.Scene {

    mainTitle: Phaser.GameObjects.Text;
    mainCharacter: MainCharacter;
    cursors: Phaser.Input.Keyboard.CursorKeys;
    shootKey: Phaser.Input.Keyboard.Key;
    camera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super({key: "CityScene"});        
    }

    init(params): void {
        
    }

    preload(): void {
        this.load.setBaseURL('http://fearfighter.nnset.com/');
        this.load.image('city', 'assets/Scenes/city.jpg');

        this.mainCharacter.preload();
    }
    
    create(): void {
        this.mainCharacter = new MainCharacter(this, 500, 450, 2);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey('X');
        this.add.image(0, 0, 'city').setOrigin(0, 0).setScale(1);

        this.mainCharacter.create();

        this.camera = this.cameras.add(0, 0);
        this.camera.setZoom(1.20);
        this.camera.setBounds(
            0, 
            0, 
            parseInt(this.game.config.width.toString()), 
            parseInt(this.game.config.height.toString())
        );

        this.camera.startFollow(this.mainCharacter);
    }

    update(time): void {
        if (this.shootKey.isDown) {
            this.mainCharacter.shoot();
        } else {
            this.moveMainCharacter();
        }
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
};