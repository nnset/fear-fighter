import { Enemy } from '../characters/enemy';
import { FearCounter } from './fearCounter';

export class Score {

    readonly KILL_ENEMY_POINTS = 100;
    
    public points: number;
    public enemiesKilled: number;
    public shootsFired: number;

    private beingDifferentKilled: number;
    private darkKilled: number;
    private publicSpeakingKilled: number;
    private fearCounter: FearCounter;

    constructor() {
        this.points = 0;
        this.darkKilled = 0;
        this.enemiesKilled = 0;
        this.beingDifferentKilled = 0;
        this.publicSpeakingKilled = 0;
        this.shootsFired = 0;
        this.fearCounter = new FearCounter();
    }

    public enemyKilled(enemyType: string): number {
        this.points += this.KILL_ENEMY_POINTS;
        this.enemiesKilled++;

        switch (enemyType) {
            case Enemy.TYPE_BEING_DIFFERENT:
                this.beingDifferentKilled++;
            break;
        
            case Enemy.TYPE_FEAR_OF_DARK:
                this.darkKilled++;
            break;

            case Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING:
                this.publicSpeakingKilled++;
            break;

            default:
                break;
        }

        this.fearCounter.decrease();
        return this.KILL_ENEMY_POINTS;
    }

    public enemiesKilledByType(enemyType: string): number {
        switch (enemyType) {
            case Enemy.TYPE_BEING_DIFFERENT:
                return this.beingDifferentKilled;
        
            case Enemy.TYPE_FEAR_OF_DARK:
                return this.darkKilled;

            case Enemy.TYPE_FEAR_OF_PUBLIC_SPEAKING:
                return this.publicSpeakingKilled;

            default:
                return 0;
        }
    }

    public playerShoot(): number {
        this.shootsFired++;

        return this.shootsFired;
    }

    public fearProgress(): number {
        return this.fearCounter.progress();
    }
};
