import tiles from '../../tiles';
import StaticObject from '../StaticObject';
import Tank from '../Tank';
import Bullet from '../Bullet';
import {CollisionEvent} from '../../collision/CollisionEngine';
import Explosion from '../Explosion';

export default class Concrete extends StaticObject {
    constructor(x, y) {
        super([tiles.block.concrete], 0, x, y, 8, 8);
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
        if (event.sourceObject instanceof Bullet) {
            this.scene.utils.handleDestroy(event.sourceObject, Explosion.explodeAnimationSmall());
        } else if (event.sourceObject instanceof Tank) {
            this.scene.utils.handleBarrier(event);
        }
    }
}