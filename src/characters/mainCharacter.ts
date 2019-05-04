import "phaser";

import { MuzzleFlare } from "../objects/muzzleFlare";

export class MainCharacter extends Phaser.GameObjects.Group {
    readonly IDLE = 'idle';
    readonly DEATH = 'death';
    readonly SHOOT = 'shoot';
    readonly RUN = 'run';

    private character: Phaser.GameObjects.Sprite;
    private regularMuzzleFlare: MuzzleFlare;
    private animations: Array<AnimationSettings>;
    private state: string;

    x: number;
    y: number;
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
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.state = this.IDLE;
        this.animations = [
            {key: this.IDLE, repeat: -1},
            {key: this.DEATH, repeat: 0},
            {key: this.SHOOT, repeat: 0},
            {key: this.RUN, repeat: -1},
        ];
        this.frameRate = frameRate;

        this.regularMuzzleFlare = new MuzzleFlare(
            this.scene, 
            0, 
            0, 
            this.scale * 0.75, 
            this.frameRate
        );
    }

    public preload(): void {
        this.animations.forEach(animation => {
            this.scene.load.spritesheet(
                animation.key, `assets/MainCharacter/animations/png/${animation.key}.png`, 
                {frameWidth: 140, frameHeight: 80}
            );
        });

        this.regularMuzzleFlare.preload();
    }

    public create(): void {
        this.regularMuzzleFlare.create();

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
        if (this.state != this.DEATH) {
            this.state = this.DEATH;
            this.character.anims.play(this.DEATH);
        }
    }

    public shoot(): void {
        if (this.isDead() || this.shootInProgress()) {
            return;
        }

        if (this.state != this.SHOOT) {
            this.state = this.SHOOT;
            this.character.anims.play(this.SHOOT);
            this.regularMuzzleFlare.shoot(
                this.character.x + 20,
                this.character.y
            );
        }
    }

    private shootInProgress(): boolean {
        return this.character.anims.currentAnim.key === this.SHOOT &&
               this.character.anims.isPlaying === true;
    }

    public run(): void {
        if (this.isDead() || this.shootInProgress()) {
            return;
        }

        if (this.state != this.RUN) {
            this.state = this.RUN;
            this.character.anims.play(this.RUN);
        }
    }

    public idle(): void {
        if (this.isDead() || this.shootInProgress()) {
            return;
        }
        
        if (this.state != this.IDLE) {
            this.state = this.IDLE;
            this.character.anims.play(this.IDLE);
        }
    }

    public isDead(): boolean{
        return this.state === this.DEATH;
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
