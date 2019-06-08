export class FearCounter {

    static INITIAL_FEAR = 7000;
    
    readonly DECREASE_STEP = 100;
    readonly INCREASE_STEP = 200;

    private currentFear: number;
    

    constructor(initialFear: number) {
        this.currentFear = initialFear;
    }

    public current(): number {
        return this.currentFear;
    }

    /**
     * Decreses current fear by the default amount and returns current fear counter value.
     */
    public decrease(): number {
        if (this.currentFear > 0 && this.currentFear - this.DECREASE_STEP >= 0) {
            this.currentFear -= this.DECREASE_STEP;
        }

        return this.currentFear;
    }

    /**
     * Increases current fear by the default amount and returns current fear counter value.
     */
    public increase(): number {

        if (this.currentFear < FearCounter.INITIAL_FEAR && this.currentFear + this.INCREASE_STEP <= FearCounter.INITIAL_FEAR) {
            this.currentFear += this.INCREASE_STEP;
        }      

        return this.currentFear;
    }

    public progress(): number {
        return this.currentFear/FearCounter.INITIAL_FEAR;
    }

    public noFearRemain(): boolean {
        return this.currentFear <= 0
    }
};
