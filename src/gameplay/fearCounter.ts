export class FearCounter {

    readonly INITIAL_FEAR = 1000;
    readonly DECREASE_STEP = 100;
    readonly INCREASE_STEP = 100;

    private currentFear: number;
    

    constructor() {
        this.currentFear = this.INITIAL_FEAR;
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

        if (this.currentFear < this.INITIAL_FEAR && this.currentFear + this.INCREASE_STEP <= this.INITIAL_FEAR) {
            this.currentFear += this.INCREASE_STEP;
        }      

        return this.currentFear;
    }

    public progress(): number {
        return this.currentFear/this.INITIAL_FEAR;
    }
};
