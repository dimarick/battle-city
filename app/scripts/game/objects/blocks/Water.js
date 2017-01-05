import tiles from '../../tiles';
import StaticObject from '../StaticObject';
import Tank from '../Tank';
import {CollisionEvent} from '../../collision/CollisionEngine';

export default class Water extends StaticObject {
    constructor(x, y) {
        super(tiles.block.water.states, 320, x, y, 8, 8);
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.scene = scene;
        scene.collisionEngine.attachStatic(this);
        scene.eventManager.subscribe(this, CollisionEvent.contact, (object, event) => this.handleCollision(event));
    }

    /**
     * @param {CollisionEvent} event
     */
    handleCollision(event) {
        if (event.sourceObject instanceof Tank) {
            this.scene.utils.handleBarrier(event);
        }
    }
}