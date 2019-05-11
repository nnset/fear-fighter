import 'phaser';
import { MainCharacter } from '../characters/mainCharacter';
import { Enemy } from '../characters/enemy';

export class CityScene extends Phaser.Scene {

    private mainCharacter: MainCharacter;
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private shootKey: Phaser.Input.Keyboard.Key;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private bulletsFacingRight: Phaser.Physics.Arcade.Group;
    private bulletsFacingleft: Phaser.Physics.Arcade.Group;
    private enemiesPhysics: Phaser.Physics.Arcade.Group;
    private seceneTopBoundary: Phaser.GameObjects.Zone;
    private enemies: Array<Enemy>;
    private enemiesCreatedCounter: integer;

    constructor() {
        super({key: 'CityScene'});
        this.enemies = new Array<Enemy>();
    }

    init(params): void {

    }

    preload(): void {
        this.enemiesCreatedCounter = 0;
        this.load.setBaseURL('http://fearfighter.nnset.com/');
        this.load.image('city', 'assets/Scenes/city.jpg');
        this.load.image('bullet', 'assets/Objects/bullet.png');
        this.load.image('bullet-left', 'assets/Objects/bullet-left.png');

        new Enemy(this, Enemy.TYPE_FEAR_OF_DARK, 120, 475).preload();
        new Enemy(this, Enemy.TYPE_BEING_DIFFERENT, 120, 475).preload();
        new Enemy(this, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING, 120, 475).preload();

        this.mainCharacter = new MainCharacter(this, 500, 450, 2);
        this.mainCharacter.preload();
    }
    
    create(): void {
        this.createPlayerControls();
    
        this.createSceneBackground();
    
        this.createWorldPhysics();

        this.createEnemies(3, Enemy.TYPE_BEING_DIFFERENT);
        this.createEnemies(3, Enemy.TYPE_FEAR_OF_DARK);
        this.createEnemies(3, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING);
            
        this.createMainCharacter();

        this. createCamera();
    }

    private createPlayerControls(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey('X');
    }

    private createSceneBackground(): void {
        this.add.image(0, 0, 'city').setOrigin(0, 0).setScale(1);
    }

    private createWorldPhysics(): void {
        this.bulletsFacingRight = this.physics.add.group({
            key: 'bullet',
            allowGravity: false,
            enable: true,
            velocityY: 0,
            velocityX: 1000,
            collideWorldBounds: true
        });

        this.bulletsFacingleft = this.physics.add.group({
            key: 'bullet-left',
            allowGravity: false,
            enable: true,
            velocityY: 0,
            velocityX: -1000,
            collideWorldBounds: true
        });

        this.enemiesPhysics = this.physics.add.group({
            key: 'enemy',
            allowGravity: false,
            enable: true,
            velocityY: 0,
            velocityX: 0,
            collideWorldBounds: true
        });

        this.seceneTopBoundary = this.add.zone(
            parseInt(this.game.config.width.toString())/2, 
            parseInt(this.game.config.height.toString())*0.45, 
            parseInt(this.game.config.width.toString()), 
            20
        );

        this.physics.world.on('worldbounds', this.clearBullet, this);

        this.physics.world.enable(this.seceneTopBoundary);
        (<Phaser.Physics.Arcade.Body>this.seceneTopBoundary.body).setAllowGravity(false);
        (<Phaser.Physics.Arcade.Body>this.seceneTopBoundary.body).moves = false;

        this.physics.add.collider(this.enemiesPhysics, this.bulletsFacingRight, this.bulletEnemyCollision, null, this);
        this.physics.add.collider(this.enemiesPhysics, this.bulletsFacingleft, this.bulletEnemyCollision, null, this);
    }

    private createCamera(): void {
        this.camera = this.cameras.add(0, 0);
        this.camera.setZoom(1.20);
        this.camera.setBounds(
            0, 
            0, 
            parseInt(this.game.config.width.toString()), 
            parseInt(this.game.config.height.toString())
        );

        this.camera.startFollow(this.mainCharacter.cameraObjective());
    }

    private createMainCharacter(): void {
        this.mainCharacter.create();

        this.physics.add.collider(this.seceneTopBoundary, this.mainCharacter.cameraObjective());
        (<Phaser.Physics.Arcade.Body>this.seceneTopBoundary.body).debugBodyColor = 0x00ffff;
    }

    private createEnemies(amount: integer, type: string): void {
        var i:integer = 0;

        while (i < amount) {
            var x:integer = Math.floor(Math.random() * (600 - 80)) + 80;
            var y:integer = Math.floor(Math.random() * (600 - 300)) + 300;
    
            let enemy:Enemy = new Enemy(this, type, x, y, 2, this.enemiesCreatedCounter);
            enemy.create();

            this.enemiesPhysics.add(enemy.getSprite());
            this.enemies.push(enemy);
            this.enemiesCreatedCounter++;

            i++;
        }
    }

    private clearBullet(body: Phaser.Physics.Arcade.Body) {
        if (body.gameObject.name === 'bullet') {
            this.bulletsFacingRight.remove(body.gameObject);
            body.gameObject.destroy();
        }

        if (body.gameObject.name === 'bullet-left') {
            this.bulletsFacingleft.remove(body.gameObject);
            body.gameObject.destroy();
        }
    }

    /**
     * As defined in the collider, collidedEnemy belongs to enemiesPhysics Group and
     * bullet belongs to either bulletsFacingRight or bulletsFacingleft Groups.
     */
    private bulletEnemyCollision(collidedEnemy: Phaser.GameObjects.GameObject, bullet: Phaser.GameObjects.GameObject): void {
        let objectToCollide: Array<string> = ['bullet', 'bullet-left'];

        if (objectToCollide.indexOf(bullet.name) > -1) {           
            this.enemies.forEach((enemy: Enemy) => {
                if(enemy.id === parseInt(collidedEnemy.name)) {
                    this.killEnemy(enemy);
                }
            });

            this.clearBullet(<Phaser.Physics.Arcade.Body>bullet.body);
        }
    }

    private killEnemy(enemy: Enemy): void {
        enemy.kill();
        // TODO : Update player stats
    }

    update(time, delta): void {
        if (this.shootKey.isDown) {   
            if (this.mainCharacter.shoot()) {
                this.createBullet();
            }
        } else {
            this.moveMainCharacter();
        }

        //this.moveEnemies();
    }

    public createBullet(): void {
        let bullet: Phaser.GameObjects.Sprite;

        if (this.mainCharacter.facing() === this.mainCharacter.FACING_RIGHT) {
            this.addBullet(
                'bullet', 
                this.bulletsFacingRight, 
                this.mainCharacter.bulletOrigin().x,
                this.mainCharacter.bulletOrigin().y
            );
        } else {
            this.addBullet(
                'bullet-left', 
                this.bulletsFacingleft, 
                this.mainCharacter.bulletOrigin().x,
                this.mainCharacter.bulletOrigin().y
            );
        }
    }

    private addBullet(spriteName: string, group: Phaser.Physics.Arcade.Group, x: integer, y: integer) : void {
        let bullet = group.create(x, y, spriteName);

        bullet.name = spriteName;
        (<Phaser.Physics.Arcade.Body>bullet.body).onWorldBounds = true;
    }

    private moveMainCharacter(): void {
        if (this.anyMovementKeIsPressed()) {
            if (this.cursors.left.isDown) {
                this.mainCharacter.run();
                this.mainCharacter.moveLeft();
            } 
            
            if (this.cursors.right.isDown) {
                this.mainCharacter.run();
                this.mainCharacter.moveRight();
            
            } if (this.cursors.up.isDown) {
                this.mainCharacter.run();
                this.mainCharacter.moveUp();
            } 
            
            if (this.cursors.down.isDown) {
                this.mainCharacter.run();
                this.mainCharacter.moveDown();
            }                 
        } else {
            this.mainCharacter.idle();
        }
    }

    private anyMovementKeIsPressed(): boolean {
        return this.cursors.up.isDown  || this.cursors.down.isDown ||
               this.cursors.left.isDown || this.cursors.right.isDown;
    }

    private moveEnemies(): void {
        
        /*
        for (let enemy of this.enemiesPhysics.children) {
            if (enemy.x > parseInt(this.game.config.width.toString()) - 20 || enemy.x < 20) {
                enemy.changeOrientation();
            }

            enemy.move();
        }
        */
    }
};