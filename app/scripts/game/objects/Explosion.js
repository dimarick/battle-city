import {SceneEvents} from '../Scene';
import OnceObject from './OnceObject';
import tiles from '../tiles';

export default class Explosion {
    /**
     * @param {StaticObject} targetObject
     * @param {StaticObject} nextObject
     * @param {int} stages
     */
    constructor(targetObject, nextObject, stages) {
        this.targetObject = targetObject;
        this.nextObject = nextObject;
        this.stages = stages;
    }

    /**
     *
     * @param {Scene} scene
     */
    onAttach(scene) {
        const explosion = new OnceObject(tiles.explosion.stage.slice(0, this.stages), 120, this.targetObject.x, this.targetObject.y);

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

        if (this.nextObject !== undefined) {
            data.scene.attach(this.nextObject);
        }
    }

    render() {}
}