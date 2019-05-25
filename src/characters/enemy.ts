import "phaser";

export class Enemy extends Phaser.GameObjects.GameObject {
    static readonly TYPE_BEING_DIFFERENT = 'BeingDifferent';
    static readonly TYPE_FEAR_OF_DARK = 'FearOfDark';
    static readonly TYPE_FEAR_OF_PUBLIC_SPEAKING = 'FearOfPublicSpeaking';
    static readonly VERTICAL_SPEED = 100;
    static readonly HORIZONTAL_SPEED = 170;
    static readonly IDLE = 'idle';
    static readonly DEATH = 'death';
    static readonly RUN = 'run';
    static readonly FACING_RIGHT = 1;
    static readonly FACING_LEFT = 2;

    private sprite: Phaser.GameObjects.Sprite;
    private animations: Array<AnimationSettings>;
    private animationState: string;

    private intialX: number;
    private initialY: number;
    private scale: number;
    private frameRate: number;
    private facingTo: number;
    private skin: string;
    private killedAt: number;
    private disapearTime: number;

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
        this.animationState = Enemy.IDLE;
        this.frameRate = frameRate;
        this.facingTo = Enemy.FACING_RIGHT;
        this.skin = skin;
        this.name = 'enemy';
        this.id = id;
        this.killedAt = 0;
        this.disapearTime = Math.floor(Math.random() * 8000) + 1500;

        this.animations = [
            {key: this.skin+Enemy.IDLE,  assetKey: Enemy.IDLE, repeat: -1, frameRate: this.frameRate, frameWidth: 50, frameHeight: 50},
            {key: this.skin+Enemy.DEATH, assetKey: Enemy.DEATH, repeat: 0, frameRate: this.frameRate, frameWidth: 140, frameHeight: 80},
            {key: this.skin+Enemy.RUN ,  assetKey: Enemy.RUN, repeat: -1 , frameRate: this.frameRate, frameWidth: 50, frameHeight: 55},
        ];
    }

    public preload(): void {
        this.animations.forEach(animation => {
            this.scene.load.spritesheet(
                animation.key, `assets/Enemies/${this.skin}/${animation.assetKey}.png`, 
                {frameWidth: animation.frameWidth, frameHeight: animation.frameHeight}
            );
        });
    }

    public create(): void {
        this.sprite = this.scene.add.sprite(this.intialX, this.initialY, Enemy.IDLE, 0).setScale(this.scale);
        this.scene.physics.world.enable(this.sprite);
        this.sprite.name = ''+this.id;
        //Seems that Physics body does not use sprite's scale in order to set its dimensions.
        this.spritePhysicsBody().width  *= this.scale;
        this.spritePhysicsBody().height *= this.scale;

        this.createAnimations();

        this.sprite.anims.play(this.skin+Enemy.IDLE);
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

    public updateMovement(): void {
        if (this.isDead()) {
            return;
        }
        
        if (this.spritePhysicsBody().velocity.x === 0) {
            this.idle();
            return;
        }

        this.run();
    }

    public kill(time: number): void {
        if (this.animationState != Enemy.DEATH) {
            this.animationState = Enemy.DEATH;
            this.sprite.anims.play(this.skin+Enemy.DEATH);
            this.spritePhysicsBody().setVelocityX(0);
            this.spritePhysicsBody().setVelocityY(0);
            this.scene.physics.world.disable(this.sprite);
            this.killedAt = time;
        }
    }

    private idle(): void {
        if (this.isDead()) {
            return;
        }
        
        if (this.animationState != Enemy.IDLE) {
            this.animationState = Enemy.IDLE;
            this.sprite.anims.play(this.skin+Enemy.IDLE);
            this.spritePhysicsBody().setVelocityX(0);
            this.spritePhysicsBody().setVelocityY(0);            
        }
    }

    private run(): void {
        if (this.isDead()) {
            return;
        }
        
        if (this.animationState != Enemy.RUN) {
            this.animationState = Enemy.RUN;
            this.sprite.anims.play(this.skin+Enemy.RUN);
        }

        if (this.spritePhysicsBody().velocity.x > 0) {
            this.sprite.flipX = false;    
        } else {
            this.sprite.flipX = true;
        }
    }   

    public isDead(): boolean {
        return this.animationState === Enemy.DEATH;
    }

    public enemyType(): string {
        return this.skin;
    }

    public isTimeToDisapear(time: number): boolean {
        return this.isDead() && time - this.killedAt > this.disapearTime;
    }

    public destroy(fromScene?: boolean): void {
        super.destroy(fromScene);
        this.sprite.destroy();
    }
};

declare type AnimationSettings = {
    assetKey: string;
    frameRate: number;
    frameWidth: number;
    frameHeight: number;
    key: string;
    repeat: number; // -1 => forever
};
