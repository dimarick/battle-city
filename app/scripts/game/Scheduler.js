export default class Scheduler {
    /**
     * @param {Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        this.tasks = new Map;
    }

    /**
     * @param {Function} callback(time, callback, timeout)
     * @param {int} interval in milliseconds
     * @returns {Object}
     */
    timeout(callback, interval) {
        const triggerTime = this.scene.getTime() + interval;
        this.tasks.set(callback, [triggerTime, interval]);

        return callback;
    }

    /**
     * @param {Function} callback
     */
    clearTimeout(callback) {
        this.tasks.delete(callback);
    }

    /**
     * @param {number} time
     */
    dispatch(time) {
        this.tasks.forEach((timerDef, callback) => {
            const [timeout, interval] = timerDef;

            if (timeout > time) {
                return;
            }

            this.tasks.set(callback, [timeout + interval, interval]);

            callback(time, callback, timeout);
        });
    }
}