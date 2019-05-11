import "phaser";

export class Enemy extends Phaser.GameObjects.GameObject {
    static readonly TYPE_BEING_DIFFERENT = 'BeingDifferent';
    static readonly TYPE_FEAR_OF_DARK = 'FearOfDark';
    static readonly TYPE_FEAR_OF_PUBLIC_SPEAKING = 'FearOfPublicSpeaking';
    
    readonly IDLE = 'idle';
    readonly DEATH = 'death';
    readonly RUN = 'run';
    readonly VERTICAL_SPEED = 200;
    readonly HORIZONTAL_SPEED = 200;
    readonly FACING_RIGHT = 1;
    readonly FACING_LEFT = 2;

    private sprite: Phaser.GameObjects.Sprite;
    private animations: Array<AnimationSettings>;
    private animationState: string;

    private intialX: number;
    private initialY: number;
    private scale: number;
    private frameRate: number;
    private facingTo: number;
    private skin: string;

    public id: integer;

    constructor(
        scene: Phaser.Scene, 
        skin: string,
        x: number = 0, 
        y: number = 0, 
        scale: number = 1, 
        id: integer = 1,        
        frameRate: number = 8
    ) {
        super(scene, 'enemy');
        this.scene = scene;
        this.intialX = x;
        this.initialY = y;
        this.scale = scale;
        this.animationState = this.IDLE;
        this.frameRate = frameRate;
        this.facingTo = this.FACING_RIGHT;
        this.skin = skin;
        this.name = 'enemy';
        this.id = id;

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
        this.sprite = this.scene.add.sprite(this.intialX, this.initialY, this.IDLE, 0).setScale(this.scale);
        this.scene.physics.world.enable(this.sprite);
        this.sprite.name = ''+this.id;
        //Seems that Physics body does not use sprite's scale in order to set its dimensions.
        this.spritePhysicsBody().width  *= this.scale;
        this.spritePhysicsBody().height *= this.scale;

        this.createAnimations();

        this.sprite.anims.play(this.skin+this.IDLE);
    }

    private spritePhysicsBody(): Phaser.Physics.Arcade.Body {
        return (<Phaser.Physics.Arcade.Body>this.sprite.body);
    }

    public getSprite(): Phaser.GameObjects.Sprite {
        return this.sprite;
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

    public kill(): void {
        if (this.animationState != this.DEATH) {
            this.animationState = this.DEATH;
            this.sprite.anims.play(this.skin+this.DEATH);
            this.spritePhysicsBody().setVelocityX(0);
            this.spritePhysicsBody().setVelocityY(0);
            this.scene.physics.world.disable(this.sprite);
        }
    }

    public idle(): void {
        if (this.isDead()) {
            return;
        }
        
        if (this.animationState != this.IDLE) {
            this.animationState = this.IDLE;
            this.sprite.anims.play(this.skin+this.IDLE);
            this.spritePhysicsBody().setVelocityX(0);
            this.spritePhysicsBody().setVelocityY(0);            
        }
    }

    public isDead(): boolean {
        return this.animationState === this.DEATH;
    }
};

declare type AnimationSettings = {
    assetKey: string;
    frameRate: number;
    key: string;
    repeat: number; // -1 => forever
};
