export default class EventManager {
    constructor() {
        this.listeners = new WeakMap();
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
     * @param {int} id
     */
    unsubscribe(object, eventName, id) {
        const listeners = this._getListeners(object, eventName);
        delete listeners[id];
        this._setListeners(object, eventName, listeners);
    }

    /**
     * @param {object|object[]} object
     * @param {string} eventName
     * @param data
     */
    dispatch(object, eventName, data) {
        const that = this;
        this._getListeners(object, eventName).forEach((listener) => {
            listener(object, data, eventName, that);
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