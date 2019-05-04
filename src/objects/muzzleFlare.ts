import "phaser";

export class MuzzleFlare extends Phaser.GameObjects.Group {

    sprite: Phaser.GameObjects.Sprite;
    scale: number;
    frameRate: number;

    constructor(
        scene: Phaser.Scene, 
        x: number = 0,
        y: number = 0, 
        scale: number = 1, 
        frameRate: number = 8
    ) {
        super(scene);
        this.scale = scale;
        this.frameRate = frameRate;
    }

    public preload(): void {
        this.scene.load.spritesheet(
            'regularMuzzleFlare', 'assets/Objects/regular-muzzle-flare.png', 
            {frameWidth: 140, frameHeight: 80}
        );
    }

    public create(): void {
        this.sprite = this.scene.add.sprite(0, 0, 'regularMuzzleFlare', 0).setScale(this.scale);
        this.sprite.visible = false;
        this.createAnimations();
    }

    private createAnimations(): void {
        this.sprite.anims.animationManager.create({
                key: 'regularMuzzleFlare', 
                frameRate: this.frameRate, 
                frames: this.sprite.anims.animationManager.generateFrameNumbers('regularMuzzleFlare', {}),
                repeat: 0
            }
        );
        this.sprite.anims.load('regularMuzzleFlare');
    }

    public shoot(x: number, y:number): void {
        this.sprite.visible = true;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.anims.play('regularMuzzleFlare');
    }
};
