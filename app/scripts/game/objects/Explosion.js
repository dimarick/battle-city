import {SceneEvents} from '../Scene';
import OnceObject from './OnceObject';
import tiles from '../tiles';

export default class Explosion {
    /**
     * @param {StaticObject} targetObject
     * @param {StaticObject} nextObject
     */
    constructor(targetObject, nextObject) {
        this.targetObject = targetObject;
        this.nextObject = nextObject;
    }

    /**
     *
     * @param {Scene} scene
     */
    onAttach(scene) {
        const explosion = new OnceObject(tiles.explosion.stage, 120, this.targetObject.x, this.targetObject.y);

        scene.detach(this.targetObject);
        scene.attach(explosion);
        scene.eventManager.subscribe(explosion, SceneEvents.detach, this.onExplosionDetach, this)
    }

    /**
     * @param {object} object
     * @param data
     * @param eventName
     * @param {EventManager} eventManager
     */
    onExplosionDetach(object, data, eventName, eventManager) {
        eventManager.unsubscribe(object, eventName);
        data.scene.attach(this.nextObject);
    }

    render() {}
}