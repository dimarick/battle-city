export default class EventManager {
    constructor() {
        this.listeners = new WeakMap();
        this.dispatching = undefined;
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @param {Function} callback
     */
    subscribe(object, eventName, callback) {
        this._getListeners(object, eventName).push(callback);
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @param {?Function} callback
     */
    unsubscribe(object, eventName, callback) {
        if (callback === undefined) {
            if (this.dispatching === undefined) {
                return;
            }

            callback = this.dispatching;
        }

        this._setListeners(object, eventName, this._getListeners(object, eventName).filter((value) => {
            return value !== callback;
        }));
    }

    /**
     * @param {object|object[]} object
     * @param {string} eventName
     * @param data
     */
    dispatch(object, eventName, data) {
        const that = this;
        this._getListeners(object, eventName).forEach((listener) => {
            that.dispatching = listener;
            listener(object, data, eventName, that);
            that.dispatching = undefined;
        })
    }

    /**
     * @param {Iterable} objects
     * @param {string} eventName
     * @param data
     */
    dispatchMultiple(objects, eventName, data) {
        objects.forEach((object) => this.dispatch(object, eventName, data));
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @returns {Function[]}
     * @private
     */
    _getListeners(object, eventName) {
        this.listeners.set(object, this.listeners.get(object) || {});
        this.listeners.get(object)[eventName] = this.listeners.get(object)[eventName] || [];

        return this.listeners.get(object)[eventName];
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @param {Function[]} listeners
     * @private
     */
    _setListeners(object, eventName, listeners) {
        this.listeners.set(object, this.listeners.get(object) || {});
        this.listeners.get(object)[eventName] = this.listeners.get(object)[eventName] || [];

        this.listeners.get(object)[eventName] = listeners;
    }
}