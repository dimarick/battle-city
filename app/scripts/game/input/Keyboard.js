import {SceneEvents} from '../Scene'

export default class Keyboard
{
    /**
     * @param bindings
     * @param target
     * @param {EventManager} eventManager
     */
    constructor(bindings, target, eventManager) {
        this.bindings = bindings;
        this.target = target;
        this.eventManager = eventManager;
    }

    attach() {
        const that = this;

        this.keydownHandler = (event) => {
            that.keydown(event);
            return false;
        };

        this.keyupHandler = (event) => {
            that.keyup(event);
            return false;
        };

        document.addEventListener('keydown', this.keydownHandler, true);
        document.addEventListener('keyup', this.keyupHandler, true);
        this.eventManager.subscribe(this.target, SceneEvents.detach, this.detachObject, this)
    }

    detach() {
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);
    }

    /**
     * @param {KeyboardEvent} event
     */
    keydown(event) {
        if (this._isRepeated(event.keyCode)) {
            return false;
        }
        const command = this.bindings[event.keyCode];
        if (command === undefined) {
            return false;
        }

        this.eventManager.dispatch(this.target, command.start);

        return false;
    }

    /**
     * @param {KeyboardEvent} event
     */
    keyup(event) {
        const command = this.bindings[event.keyCode];
        if (command === undefined) {
            return false;
        }
        this._resetRepeated();

        this.eventManager.dispatch(this.target, command.stop);

        return false;
    }

    //noinspection JSUnusedLocalSymbols
    /**
     * @param object
     * @param data
     * @param eventName
     * @param {EventManager} eventManager
     */
    detachObject(object, data, eventName, eventManager) {
        this.detach();
        eventManager.unsubscribe(object, eventName);
    }

    _isRepeated(keyCode) {
        if (this.prevKeyCode === keyCode) {
            return true;
        }

        this.prevKeyCode = keyCode;

        return false;
    }

    _resetRepeated() {
        delete this.prevKeyCode;
    }
}