import {SceneEvents} from '../Scene'

export default class Keyboard
{
    /**
     * @param bindings
     * @param {EventManager} eventManager
     */
    constructor(bindings, eventManager) {
        this.bindings = bindings;
        this.eventManager = eventManager;
    }

    attach(object) {
        this.target = object;

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
        this.detachTargetSubscription = this.eventManager.subscribe(this.target, SceneEvents.detach, this.detachObject.bind(this));
    }

    detach() {
        if (this.target !== undefined) {
            document.removeEventListener('keydown', this.keydownHandler);
            document.removeEventListener('keyup', this.keyupHandler);
            this.eventManager.unsubscribe(this.target, SceneEvents.detach, this.detachTargetSubscription);

            delete this.target;
            delete this.detachTargetSubscription;
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    keydown(event) {
        if (this.target === undefined) {
            return false;
        }

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
        if (this.target === undefined) {
            return false;
        }

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
        if (object === this.target) {
            this.detach();
        }
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