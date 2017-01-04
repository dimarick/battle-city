export default class EventManager {
    constructor() {
        this.listeners = new Map();
        this.dispatching = undefined;
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @param {Function} callback
     * @param {?*} context
     */
    subscribe(object, eventName, callback, context) {
        this._getListeners(object, eventName).push([callback, context]);
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @param {?Function} callback
     * @param {?*} context
     */
    unsubscribe(object, eventName, callback, context) {
        if (callback === undefined) {
            if (this.dispatching === undefined) {
                return;
            }

            callback = this.dispatching;
        }

        this._setListeners(object, eventName, this._getListeners(object, eventName).filter((value) => {
            return value !== [callback, context];
        }));
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @param data
     */
    dispatch(object, eventName, data) {
        const that = this;
        this._getListeners(object, eventName).forEach((listener) => {
            that.dispatching = listener;
            listener[0].call(listener[1], object, data, eventName, that);
            that.dispatching = undefined;
        })
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