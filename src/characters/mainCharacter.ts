import "phaser";

export class MainCharacter extends Phaser.GameObjects.Group {

    character: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    init(params): void {
        // TODO
    }

    preload(): void {
        this.scene.load.setBaseURL("https://nnset.github.io/fearfighter/");
        this.scene.load.spritesheet('idle', 'assets/MainCharacter/Animation/png/idle.png', { frameWidth: 140, frameHeight: 80 });
    }
    
    create(): void {
        this.character = this.scene.add.sprite(50, 50, 'idle', 0);       
        this.character.anims.load('idle');
        this.character.play('idle');
    }

    update(time): void {
        // TODO
    }
};