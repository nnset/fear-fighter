import "phaser";

export class Enemy extends Phaser.GameObjects.GameObject {
    static readonly TYPE_BEING_DIFFERENT = 'BeingDifferent';
    static readonly TYPE_FEAR_OF_DARK = 'FearOfDark';
    static readonly TYPE_FEAR_OF_PUBLIC_SPEAKING = 'FearOfPublicSpeaking';
    
    readonly IDLE = 'idle';
    readonly DEATH = 'death';
    readonly RUN = 'run';

    readonly VERTICAL_SPEED = 1;
    readonly HORIZONTAL_SPEED = 1;

    readonly FACING_RIGHT = 1;
    readonly FACING_LEFT = 2;

    private character: Phaser.GameObjects.Sprite;
    private animations: Array<AnimationSettings>;
    private animationState: string;

    x: number;
    y: number;
    scale: number;
    frameRate: number;
    facingTo: number;
    skin: string;

    constructor(
        scene: Phaser.Scene, 
        skin: string,
        x: number = 0, 
        y: number = 0, 
        scale: number = 1, 
        frameRate: number = 8
    ) {
        super(scene, 'enemy');
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.animationState = this.IDLE;
        this.frameRate = frameRate;
        this.facingTo = this.FACING_RIGHT;
        this.skin = skin;

        this.animations = [
            {key: this.skin+this.IDLE,  assetKey: this.IDLE, repeat: -1, frameRate: this.frameRate},
            {key: this.skin+this.DEATH, assetKey: this.DEATH, repeat: 0, frameRate: this.frameRate},
            {key: this.skin+this.RUN ,  assetKey: this.RUN, repeat: -1 , frameRate: this.frameRate},
        ];
    }

    public preload(): void {
        this.animations.forEach(animation => {
            this.scene.load.spritesheet(
                animation.key, `assets/Enemies/${this.skin}/${animation.assetKey}.png`, 
                {frameWidth: 140, frameHeight: 80}
            );
        });
    }

    public create(): void {
        this.character = this.scene.add.sprite(this.x, this.y, this.IDLE, 0).setScale(this.scale);
        this.createAnimations();

        this.character.anims.play(this.skin+this.RUN);
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
        if (this.animationState != this.DEATH) {
            this.animationState = this.DEATH;
            this.character.anims.play(this.skin+this.DEATH);
        }
    }

    public run(): void {
        if (this.isDead()) {
            return;
        }

        if (this.animationState != this.RUN) {
            this.animationState = this.RUN;
            this.character.anims.play(this.skin+this.RUN);
        }
    }

    public idle(): void {
        if (this.isDead()) {
            return;
        }
        
        if (this.animationState != this.IDLE) {
            this.animationState = this.IDLE;
            this.character.anims.play(this.skin+this.IDLE);
        }
    }

    public isDead(): boolean {
        return this.animationState === this.DEATH;
    }

    public move(): void {
        if (this.facingTo === this.FACING_RIGHT) {
            this.x += this.HORIZONTAL_SPEED;
        } else {
            this.x -= this.HORIZONTAL_SPEED;
        }

        this.character.x = this.x;
    }

    public changeOrientation() {
        if (this.facingTo === this.FACING_RIGHT) {
            this.facingTo = this.FACING_LEFT;
        } else {
            this.facingTo = this.FACING_RIGHT;
        }

        this.character.scaleX *= -1;
    }
};

declare type AnimationSettings = {
    assetKey: string;
    frameRate: number;
    key: string;
    repeat: number; // -1 => forever
};
