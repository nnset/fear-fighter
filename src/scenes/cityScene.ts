import 'phaser';
import { Score } from '../gameplay/score';
import { MainCharacter } from '../characters/mainCharacter';
import { Enemy } from '../characters/enemy';
import { HUD } from '../ui/headsUpDisplay';

export class CityScene extends Phaser.Scene {

    private mainCharacter: MainCharacter;
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private shootKey: Phaser.Input.Keyboard.Key;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private bulletsFacingRight: Phaser.Physics.Arcade.Group;
    private bulletsFacingleft: Phaser.Physics.Arcade.Group;
    private enemiesPhysics: Phaser.Physics.Arcade.Group;
    private mainCharacterSceneTopBoundary: Phaser.GameObjects.Zone;
    private enemiesSceneTopBoundary: Phaser.GameObjects.Zone;
    private enemies: Array<Enemy>;
    private enemiesSpawnCoordinates: Array<Phaser.Math.Vector2>;
    private enemiesCreatedCounter: integer;
    private score: Score;
    private hud: HUD;
    private lastEnemiesSpawnTime: number;
    
    private readonly MAX_ENEMIES = 20;

    constructor() {
        super({key: 'CityScene'});
        this.enemies = new Array<Enemy>();
        this.enemiesSpawnCoordinates = new Array<Phaser.Math.Vector2>();
        this.score = new Score();
        this.lastEnemiesSpawnTime = 0;
    }

    init(params): void {
        this.scene.remove('WelcomeScene');
    }

    preload(): void {
        this.enemiesCreatedCounter = 0;
        this.load.setBaseURL('http://fearfighter.nnset.com/');
        /*
        this.load.image('city', 'assets/Scenes/city.jpg');
        this.load.image('bullet', 'assets/Objects/bullet.png');
        this.load.image('bullet-left', 'assets/Objects/bullet-left.png');

        new Enemy(this, Enemy.TYPE_FEAR_OF_DARK, 120, 475).preload();
        new Enemy(this, Enemy.TYPE_BEING_DIFFERENT, 120, 475).preload();
        new Enemy(this, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING, 120, 475).preload();

        
        this.mainCharacter.preload();
*/
        this.hud = new HUD(this, 0, 0, this.score);
        this.hud.preload();  
        this.generateEnemiesSpawnCoordinates();
    }

    private generateEnemiesSpawnCoordinates() : void {

        this.enemiesSpawnCoordinates.push(new Phaser.Math.Vector2(76, 451));
        this.enemiesSpawnCoordinates.push(new Phaser.Math.Vector2(112, 628));
        this.enemiesSpawnCoordinates.push(new Phaser.Math.Vector2(160, 558));
        this.enemiesSpawnCoordinates.push(new Phaser.Math.Vector2(425, 600));
        this.enemiesSpawnCoordinates.push(new Phaser.Math.Vector2(600, 450));
        this.enemiesSpawnCoordinates.push(new Phaser.Math.Vector2(827, 585));
        this.enemiesSpawnCoordinates.push(new Phaser.Math.Vector2(1029, 591));
        this.enemiesSpawnCoordinates.push(new Phaser.Math.Vector2(1100, 425));

        for (var i = this.enemiesSpawnCoordinates.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.enemiesSpawnCoordinates[i];
            this.enemiesSpawnCoordinates[i] = this.enemiesSpawnCoordinates[j];
            this.enemiesSpawnCoordinates[j] = temp;
        }
    }
    
    create(): void {
        this.createPlayerControls();
    
        this.createSceneBackground();
    
        this.createWorldPhysics();

        this.createEnemies(3, Enemy.TYPE_BEING_DIFFERENT);
        this.createEnemies(3, Enemy.TYPE_FEAR_OF_DARK);
        this.createEnemies(3, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING);
        
        this.createMainCharacter();

        this.createCamera();

        this.hud.create();
        this.add.existing(this.hud.backgroundArea);
        this.add.existing(this.hud.fearBar);
        this.add.existing(this.hud.bulletIcon);
        this.add.existing(this.hud.shootsCounter);
        this.add.existing(this.hud.scoreCounter);     
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
            allowGravity: false,
            enable: true,
            velocityY: Enemy.VERTICAL_SPEED,
            velocityX: Enemy.HORIZONTAL_SPEED,
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true
        });

        this.mainCharacterSceneTopBoundary = this.add.zone(
            parseInt(this.game.config.width.toString())/2, 
            parseInt(this.game.config.height.toString())*0.55, 
            parseInt(this.game.config.width.toString()), 
            20
        );

        this.enemiesSceneTopBoundary = this.add.zone(
            parseInt(this.game.config.width.toString())/2, 
            parseInt(this.game.config.height.toString())*0.55, 
            parseInt(this.game.config.width.toString()), 
            20
        );

        this.physics.world.on('worldbounds', this.onWorldBoundsHandler, this);

        this.physics.world.enable(this.mainCharacterSceneTopBoundary);
        (<Phaser.Physics.Arcade.Body>this.mainCharacterSceneTopBoundary.body).setAllowGravity(false);
        (<Phaser.Physics.Arcade.Body>this.mainCharacterSceneTopBoundary.body).moves = false;

        this.physics.world.enable(this.enemiesSceneTopBoundary);
        (<Phaser.Physics.Arcade.Body>this.enemiesSceneTopBoundary.body).setAllowGravity(false);
        (<Phaser.Physics.Arcade.Body>this.enemiesSceneTopBoundary.body).moves = false;

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
        this.mainCharacter = new MainCharacter(this, 500, 450, 2);
        this.mainCharacter.create();

        this.physics.add.collider(this.mainCharacterSceneTopBoundary, this.mainCharacter.cameraObjective());
        (<Phaser.Physics.Arcade.Body>this.mainCharacterSceneTopBoundary.body).debugBodyColor = 0x00ffff;

        let collider = this.physics.add.collider(this.mainCharacter.cameraObjective(), this.enemiesPhysics, this.mainCharacterEnemyCollision, null, this);
        collider.overlapOnly = true;
    }

    private createEnemies(amount: integer, type: string): void {
        var i:integer = 0;

        while (i < amount && this.enemies.length <= this.MAX_ENEMIES) {
            var spawnPosition = Phaser.Math.Between(0, this.enemiesSpawnCoordinates.length - 1);

            this.createEnemy(type, this.enemiesSpawnCoordinates[spawnPosition].x, this.enemiesSpawnCoordinates[spawnPosition].y);

            this.enemiesCreatedCounter++;

            i++;
        }
    }

    private createEnemy(type: string, x: number, y: number): Enemy {
        let enemy:Enemy = new Enemy(this, type, x, y, 2, this.enemiesCreatedCounter);
        enemy.create();

        this.enemiesPhysics.add(enemy.getSprite());
        this.physics.add.collider(
            this.enemiesSceneTopBoundary, 
            enemy.getSprite(), 
            this.enemiesSceneTopBoundaryCollision, 
            null, 
            this
        );

        enemy.speed(new Phaser.Math.Vector2(
            Phaser.Math.Between(Enemy.HORIZONTAL_SPEED * 0.2, Enemy.HORIZONTAL_SPEED * 1.2),
            Phaser.Math.Between(Enemy.VERTICAL_SPEED * 0.2, Enemy.VERTICAL_SPEED * 1.2)
        ));

        this.enemies.push(enemy);

        return enemy;
    }

    private enemiesSceneTopBoundaryCollision(sceneTopBoundary, enemySprite): void {
        let enemyPhysicsBody = (<Phaser.Physics.Arcade.Body>enemySprite.body);

        if(enemyPhysicsBody.velocity.y <= 0) {
            const randomVerticalSpeed: number = 
                Phaser.Math.Between(Enemy.VERTICAL_SPEED * 0.2, Enemy.VERTICAL_SPEED * 1.20);

            enemyPhysicsBody.velocity.y = randomVerticalSpeed;

            if (Math.random() >= 0.45) {
                const randomHorizontalSpeed: number = 
                    Phaser.Math.Between(Enemy.HORIZONTAL_SPEED * 0.2, Enemy.HORIZONTAL_SPEED * 1.5);

                enemyPhysicsBody.velocity.x = -randomHorizontalSpeed;
            }
        }
    }

    private onWorldBoundsHandler(body: Phaser.Physics.Arcade.Body): void {
        if (body.gameObject.name === 'bullet') {
            this.bulletsFacingRight.remove(body.gameObject);
            body.gameObject.destroy();
            
            return;
        }

        if (body.gameObject.name === 'bullet-left') {
            this.bulletsFacingleft.remove(body.gameObject);
            body.gameObject.destroy();

            return;
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

            this.onWorldBoundsHandler(<Phaser.Physics.Arcade.Body>bullet.body);
        }
    }

    private mainCharacterEnemyCollision(mainCharacter: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject): void {
        if (this.mainCharacter.hit(this.time.now)) {
            this.score.playerWasHit();
            this.hud.playerWasHit();
        }
    }

    private killEnemy(enemy: Enemy): void {
        enemy.kill(this.time.now);
        this.score.enemyKilled(enemy.enemyType());

        if (this.score.noFearRemaining()) {
            this.scene.stop('CityScene');
            this.scene.start('WinGameScene', {'score': this.score});
        }
    }

    update(time, delta): void {
        this.updateHUD(time);
        this.mainCharacter.update(time);

        if (this.shootKey.isDown) {   
            if (this.mainCharacter.shoot()) {
                this.createBullet();
                this.score.playerShoot();
            }
        } else {
            this.moveMainCharacter();
        }

        this.updateEnemies(time);
    }

    public createBullet(): void {
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

    private updateHUD(time): void {
        let cameraTopLeftCornerWorldPoint = this.camera.getWorldPoint(0,0);
        this.hud.update(cameraTopLeftCornerWorldPoint.x, cameraTopLeftCornerWorldPoint.y);
    }

    private updateEnemies(time: number): void {
        this.cleanDeadEnemies(time);
        this.moveEnemies();
        this.spawnNewEnemies(time);
    }

    private cleanDeadEnemies(time): void {
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].isTimeToDisapear(time)) {
                (<Enemy>this.enemies[i]).destroy();
                this.enemies.splice(i,1);
            } else {
                (<Enemy>this.enemies[i]).updateMovement();
            }
        }
    }

    private moveEnemies(): void {
        for (var i = 0; i < this.enemies.length; i++) {
            if (!this.enemies[i].isDead()) {
                (<Enemy>this.enemies[i]).updateMovement();
            }
        }
    }

    private spawnNewEnemies(time: number): void {
        if (time - this.lastEnemiesSpawnTime > 15000) {
            this.createEnemies(3, Enemy.TYPE_BEING_DIFFERENT);
            this.createEnemies(3, Enemy.TYPE_FEAR_OF_DARK);
            this.createEnemies(3, Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING);
            
            this.lastEnemiesSpawnTime = time;
        }
    }
};