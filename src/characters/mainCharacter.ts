import "phaser";

export class MainCharacter extends Phaser.GameObjects.Group {
    readonly IDLE = 'idle';
    readonly DEATH = 'death';
    readonly SHOOT = 'shoot';

    character: Phaser.GameObjects.Sprite;
    x: number;
    y: number;
    scale: number;
    frameRate: number;
    animations: Array<AnimationSettings>;


    constructor(
        scene: Phaser.Scene, 
        x: number = 0, 
        y: number = 0, 
        scale: number = 1, 
        frameRate: number = 8
    ) {
        super(scene);
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.animations = [
            {key: this.IDLE, repeat: -1},
            {key: this.DEATH, repeat: 0},
            {key: this.SHOOT, repeat: 0},
        ];
        this.frameRate = frameRate;
    }

    public preload(): void {
        this.animations.forEach(animation => {
            this.scene.load.spritesheet(
                animation.key, `assets/MainCharacter/animations/png/${animation.key}.png`, 
                {frameWidth: 140, frameHeight: 80}
            );
        });
    }

    public create(): void {
        this.character = this.scene.add.sprite(this.x, this.y, this.IDLE, 0).setScale(this.scale);
        
        this.createAnimations();

        this.character.anims.play(this.IDLE);
    }

    private createAnimations(): void {
        this.animations.forEach(animation => {
            this.character.anims.animationManager.create(this.animationSettings(animation));
            this.character.anims.load(animation.key);
        });
    }

    private animationSettings(animation: AnimationSettings): object {
        return {
            key: animation.key, 
            frameRate: this.frameRate, 
            frames: this.character.anims.animationManager.generateFrameNumbers(animation.key, {}),
            repeat: animation.repeat
        }
    }

    public die(): void {
        this.character.anims.play(this.DEATH);
    }

    public shoot(): void {
        this.character.anims.play(this.SHOOT);
    }
};

declare type AnimationSettings = {
    /**
     * The key for the animation
     */
    key: string;
    /**
     * How many times does the animation repeat. -1 => forever
     */
    repeat: number;
};
