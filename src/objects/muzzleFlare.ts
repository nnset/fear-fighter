import "phaser";

export class MuzzleFlare extends Phaser.GameObjects.GameObject {

    readonly FACING_RIGHT = 1;
    readonly FACING_LEFT = 2;

    sprite: Phaser.GameObjects.Sprite;
    scale: number;
    frameRate: number;
    facingTo: number;

    constructor(
        scene: Phaser.Scene, 
        x: number = 0,
        y: number = 0, 
        scale: number = 1, 
        frameRate: number = 16
    ) {
        super(scene, 'MuzzleFlare');
        this.scale = scale;
        this.frameRate = frameRate;
        this.facingTo = this.FACING_RIGHT;
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

    public show(x: number, y:number, orientation: number = this.FACING_RIGHT, currentPositionScale: number): void {
        this.sprite.visible = true;

        this.sprite.setScale(Math.min(1.10, currentPositionScale * this.scale));

        this.sprite.flipX = false;

        if (orientation === this.FACING_LEFT) {
            this.sprite.flipX = true;
        }

        this.facingTo = orientation;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.anims.play('regularMuzzleFlare');
    }
};
