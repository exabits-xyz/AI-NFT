/**
 * Timer Helper
 */
class Timer {
    constructor(fn, delay) {
        this._triggerTimer = null;
        this._delay = delay;
        this._fn = fn;
    }

    stop() {
        if (this._triggerTimer) {
            clearTimeout(this._triggerTimer);
            this._triggerTimer = null;
        }
    }

    run() {
        this.stop();
        this._triggerTimer = setTimeout(() => {
            this._fn();
        }, this._delay);
    }
}

export default Timer;
