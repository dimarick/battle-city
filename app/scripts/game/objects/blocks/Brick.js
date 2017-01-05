import tiles from '../../tiles';
import StaticObject from '../StaticObject';
import {CollisionEvent} from '../../collision/CollisionEngine';
import Explosion from '../Explosion';
import Tank from '../Tank';
import Bullet from '../Bullet';
import {SceneEvents} from '../../Scene';

export default class Brick extends StaticObject {
    constructor(x, y) {
        super([tiles.block.brick], 0, x, y, 8, 8);
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
            if (event.sourceObject.associatedAnimation === undefined) {
                event.sourceObject.associatedAnimation = Explosion.explodeAnimationSmall();
            }

            this.scene.eventManager.subscribe(event.sourceObject.associatedAnimation, SceneEvents.detach,
                () => this.scene.detach(this)
            );
            this.scene.collisionEngine.detach(this);
            this.scene.utils.handleDestroy(event.sourceObject, event.sourceObject.associatedAnimation);
        } else if (event.sourceObject instanceof Tank) {
            this.scene.utils.handleBarrier(event);
        }
    }
}