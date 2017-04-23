export default class EventManager {
    constructor() {
        this.listeners = new WeakMap();
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @param {Function} callback
     * @param {int} priority
     */
    subscribe(object, eventName, callback, priority) {
        if (priority === undefined) {
            priority = 0;
        }

        this._getListeners(object, eventName).push([callback, priority]);
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
        return this._getListeners(object, eventName).every((listenerDef) => {
            const [callback] = listenerDef;
            if (callback(object, data, eventName, that) === EventManager.eventProcessed) {
                return false;
            }

            return true;
        })
    }

    /**
     * @param {Iterable} objects
     * @param {string} eventName
     * @param data
     */
    dispatchMultiple(objects, eventName, data) {
        objects.every((object) => {
            return this.dispatch(object, eventName, data);
        });
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @returns {Array[]}
     * @private
     */
    _getListeners(object, eventName) {
        this.listeners.set(object, this.listeners.get(object) || {});
        this.listeners.get(object)[eventName] = this.listeners.get(object)[eventName] || [];
        const listeners = this.listeners.get(object)[eventName];

        listeners.sort((listenerDef1, listenerDef2) => {
            const [, priority1] = listenerDef1;
            const [, priority2] = listenerDef2;

            return priority1 - priority2;
        });

        return listeners;
    }

    /**
     * @param {object} object
     * @param {string} eventName
     * @param {Array[]} listeners
     * @private
     */
    _setListeners(object, eventName, listeners) {
        this.listeners.set(object, this.listeners.get(object) || {});
        this.listeners.get(object)[eventName] = this.listeners.get(object)[eventName] || [];

        this.listeners.get(object)[eventName] = listeners;
    }
}

EventManager.eventProcessed = true;