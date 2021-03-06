import "phaser";

import { MuzzleFlare } from "../objects/muzzleFlare";
import { GameObjects } from "phaser";

/**
 * MainCharacter is a Phaser.GameObjects.GameObject
 * that holds physics for a Phaser.GameObjects.Sprite
 * object and also handles game logic for Player's playable character.
 */
export class MainCharacter extends Phaser.GameObjects.GameObject {
    static readonly TIME_BETWEEN_HITS = 2000;
    static readonly SHOOT = 'shoot';
    static readonly IDLE = 'idle';
    readonly DEATH = 'death';
    
    readonly RUN = 'run';
    readonly VERTICAL_SPEED = 200;
    readonly HORIZONTAL_SPEED = 200;
    readonly FACING_RIGHT = 1;
    readonly FACING_LEFT = 2;

    private sprite: Phaser.GameObjects.Sprite;
    private regularMuzzleFlare: MuzzleFlare;
    private animations: Array<AnimationSettings>;
    private animationState: string;
    private initialX: integer;
    private initialY: integer;
    private scale: number;
    private frameRate: number;
    private facingTo: number;
    private lastHit: number;

    constructor(
        scene: Phaser.Scene, 
        x: integer = 0, 
        y: integer = 0, 
        scale: number = 1, 
        frameRate: number = 8
    ) {
        super(scene, 'mainCharacter');
        this.initialX = x;
        this.initialY = y;
        this.scale = scale;
        this.animationState = MainCharacter.IDLE;
        this.frameRate = frameRate;
        this.facingTo = this.FACING_RIGHT;
        this.lastHit = 0;

        this.animations = [
            {key: MainCharacter.IDLE, repeat: -1, frameRate: this.frameRate, frameWidth: 50, frameHeight : 50},
            {key: this.DEATH, repeat: 0, frameRate: this.frameRate, frameWidth: 140, frameHeight : 80},
            {key: MainCharacter.SHOOT, repeat: 0, frameRate: this.frameRate * 2, frameWidth: 50, frameHeight : 50},
            {key: this.RUN, repeat: -1 , frameRate: this.frameRate, frameWidth: 50, frameHeight : 50},
        ];

        this.regularMuzzleFlare = new MuzzleFlare(this.scene, 0, 0, this.scale * 0.5);
        this.name = 'mainCharacter';
    }

    public preload(): void {
        this.animations.forEach(animation => {
            this.scene.load.spritesheet(
                animation.key, 
                `assets/MainCharacter/animations/png/${animation.key}.png`, 
                {frameWidth: animation.frameWidth, frameHeight: animation.frameHeight}
            );
        });

        this.regularMuzzleFlare.preload();
    }

    public create(): void {
        this.sprite = this.scene.add.sprite(this.initialX, this.initialY, MainCharacter.IDLE, 0).setScale(this.scale);
        this.sprite.setName(this.name);

        this.scene.physics.world.enable(this.sprite);
        
        this.spritePhysicsBody().setCollideWorldBounds(true);
        this.spritePhysicsBody().onWorldBounds = true;

        //Seems that Physics body does not use sprite's scale in order to set its dimensions.
        this.spritePhysicsBody().width  *= this.scale;
        this.spritePhysicsBody().height *= this.scale;

        this.createAnimations();
        this.sprite.anims.play(MainCharacter.IDLE);

        this.regularMuzzleFlare.create();
    }

    private createAnimations(): void {
        this.animations.forEach(animation => {
            this.sprite.anims.animationManager.create(this.animationSettings(animation));
            this.sprite.anims.load(animation.key);
        });
    }

    private animationSettings(animation: AnimationSettings): object {
        return {
            key: animation.key, 
            frameRate: animation.frameRate, 
            frames: this.sprite.anims.animationManager.generateFrameNumbers(animation.key, {}),
            repeat: animation.repeat
        }
    }

    private spritePhysicsBody(): Phaser.Physics.Arcade.Body {
        return (<Phaser.Physics.Arcade.Body>this.sprite.body);
    }

    public cameraObjective(): GameObjects.GameObject {
        return this.sprite;
    }

    public position(): Vector2Like {
        return this.spritePhysicsBody().center;
    }

    public bulletOrigin(): Vector2Like {
        let bulletX: number = this.position().x + 10 * this.bulletOffsetAccordingPosition();
        let bulletY: number = this.position().y + 10 * this.bulletOffsetAccordingPosition();

        if (this.facingTo === this.FACING_RIGHT) {
            bulletX += 25 * this.bulletOffsetAccordingPosition();
        }

        return {
            x: bulletX,
            y: bulletY
        };
    }

    /**
     * @returns True if the reported hit is considered a hit, false otherwise.
     */
    public hit(time: number): boolean {
        if (time - this.lastHit > MainCharacter.TIME_BETWEEN_HITS) {
            this.lastHit = time;

            this.sprite.setTint(0x00dd00);

            return true;
        }

        return false;
    }

    public die(): void {
        if (this.animationState != this.DEATH) {
            this.animationState = this.DEATH;
            this.sprite.anims.play(this.DEATH);
            this.stop();
        }
    }

    public shoot(): boolean {
        if (this.isDead() || this.shootInProgress()) {
            return false;
        }

        this.animationState = MainCharacter.IDLE;

        if (this.animationState != MainCharacter.SHOOT) {
            this.stop();

            this.animationState = MainCharacter.SHOOT;
            let muzzleFlareX = this.position().x + 20 * this.bulletOffsetAccordingPosition();
            
            if (this.facingTo === this.FACING_LEFT) {
               muzzleFlareX = this.position().x + 5 * this.bulletOffsetAccordingPosition();
            }

            this.sprite.anims.play(MainCharacter.SHOOT);

            this.regularMuzzleFlare.show(
                muzzleFlareX, 
                this.position().y + 5 * this.bulletOffsetAccordingPosition(), 
                this.facingTo,
                this.scaleAccordingPosition()
            );

            return true;
        }

        return false;
    }

    private shootInProgress(): boolean {
        return this.sprite.anims.currentAnim.key === MainCharacter.SHOOT &&
               this.sprite.anims.isPlaying === true;
    }

    public run(): void {
        if (this.isDead() || this.shootInProgress()) {
            return;
        }

        if (this.animationState != this.RUN) {
            this.animationState = this.RUN;
            this.sprite.anims.play(this.RUN);
        }
    }

    public idle(): void {
        if (this.isDead() || this.shootInProgress()) {
            return;
        }
        
        if (this.animationState != MainCharacter.IDLE) {
            this.animationState = MainCharacter.IDLE;
            this.sprite.anims.play(MainCharacter.IDLE);
        }

        this.stop();
    }

    public isDead(): boolean {
        return this.animationState === this.DEATH;
    }

    public moveRight(): void {
        if (!this.shootInProgress()) {
            this.spritePhysicsBody().setVelocityX(this.HORIZONTAL_SPEED);
            this.spritePhysicsBody().setVelocityY(0);
            
            if (this.facingTo !== this.FACING_RIGHT) {
                this.sprite.flipX = false;
            }

            this.facingTo = this.FACING_RIGHT;
        }
    }

    public moveLeft(): void {
        if (!this.shootInProgress()) {
            this.spritePhysicsBody().setVelocityX(-this.HORIZONTAL_SPEED);
            this.spritePhysicsBody().setVelocityY(0);
            
            if (this.facingTo !== this.FACING_LEFT) {
                this.sprite.flipX = this.facingTo !== this.FACING_LEFT;
            }

            this.facingTo = this.FACING_LEFT;
        }
    }

    public moveUp(): void {
        if (!this.shootInProgress()) {
            this.spritePhysicsBody().setVelocityY(-this.VERTICAL_SPEED);
        }
    }

    public moveDown(): void {
        if (!this.shootInProgress()) {
            this.spritePhysicsBody().setVelocityY(this.VERTICAL_SPEED);
        }
    }

    public stop(): void {
        this.spritePhysicsBody().setVelocityX(0);
        this.spritePhysicsBody().setVelocityY(0);
    }

    public facing(): integer {
        return this.facingTo;
    }

    public update(time: number): void {
        if (time - this.lastHit > MainCharacter.TIME_BETWEEN_HITS) { 
            this.sprite.setTint(undefined);
        }

        this.sprite.setScale(this.scaleAccordingPosition());
    }

    private scaleAccordingPosition(): number {
        return Math.min(this.scale * 1.10, this.scale * (this.position().y / 500));
    }

    private bulletOffsetAccordingPosition(): number {
        return this.position().y / 500;
    }
};

declare type AnimationSettings = {
    frameRate: number;
    frameWidth: number;
    frameHeight: number;
    key: string;
    repeat: number; // -1 => forever
};
