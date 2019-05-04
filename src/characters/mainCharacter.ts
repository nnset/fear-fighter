import "phaser";

import { MuzzleFlare } from "../objects/muzzleFlare";

export class MainCharacter {
    readonly IDLE = 'idle';
    readonly DEATH = 'death';
    readonly SHOOT = 'shoot';
    readonly RUN = 'run';
    readonly VERTICAL_SPEED = 3;
    readonly HORIZONTAL_SPEED = 3;
    readonly FACING_RIGHT = 1;
    readonly FACING_LEFT = 2;

    private character: Phaser.GameObjects.Sprite;
    private regularMuzzleFlare: MuzzleFlare;
    private animations: Array<AnimationSettings>;
    private state: string;

    x: number;
    y: number;
    scale: number;
    frameRate: number;
    facingTo: number;
    scene: Phaser.Scene;


    constructor(
        scene: Phaser.Scene, 
        x: number = 0, 
        y: number = 0, 
        scale: number = 1, 
        frameRate: number = 8
    ) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.state = this.IDLE;
        this.frameRate = frameRate;
        this.facingTo = this.FACING_RIGHT;

        this.animations = [
            {key: this.IDLE, repeat: -1, frameRate: this.frameRate},
            {key: this.DEATH, repeat: 0, frameRate: this.frameRate},
            {key: this.SHOOT, repeat: 0, frameRate: this.frameRate * 2},
            {key: this.RUN, repeat: -1 , frameRate: this.frameRate},
        ];

        this.regularMuzzleFlare = new MuzzleFlare(
            this.scene, 
            0, 
            0, 
            this.scale * 0.75
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
            frameRate: animation.frameRate, 
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

        this.state = this.IDLE;

        if (this.state != this.SHOOT) {
            this.state = this.SHOOT;           
            let muzzleFlareX = this.character.x + 20;
            
            if (this.facingTo === this.FACING_LEFT) {
               muzzleFlareX = this.character.x - 20;
            }

            this.character.anims.play(this.SHOOT);

            this.regularMuzzleFlare.show(muzzleFlareX, this.character.y, this.facingTo);
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

    public isDead(): boolean {
        return this.state === this.DEATH;
    }

    public moveRight(): void {
        if (!this.shootInProgress()) {
            this.x += this.HORIZONTAL_SPEED;
            
            if (this.facingTo !== this.FACING_RIGHT) {
                this.character.scaleX *= -1;
            }

            this.facingTo = this.FACING_RIGHT;
            this.character.x = this.x;
        }
    }

    public moveLeft(): void {
        if (!this.shootInProgress()) {
            this.x -= this.HORIZONTAL_SPEED;
            
            if (this.facingTo !== this.FACING_LEFT) {
                this.character.scaleX *= -1;
            }

            this.facingTo = this.FACING_LEFT;
            this.character.x = this.x;
        }
    }

    public moveUp(): void {
        if (!this.shootInProgress()) {
            this.y -= this.VERTICAL_SPEED;
            this.character.y = this.y;
        }
    }

    public moveDown(): void {
        if (!this.shootInProgress()) {
            this.y += this.VERTICAL_SPEED;
            this.character.y = this.y;
        }
    }
};

declare type AnimationSettings = {
    frameRate: number;
    key: string;
    repeat: number; // -1 => forever
};
