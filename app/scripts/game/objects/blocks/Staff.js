import tiles from '../../tiles';
import StaticObject from '../StaticObject';
import Tank from '../Tank';
import {CollisionEvent} from '../../collision/CollisionEngine';
import Bullet from '../Bullet';
import Explosion from '../Explosion';
import {SceneEvents} from "../../Scene";

export class StaffState {}
StaffState.normal = 'normal';
StaffState.broken = 'broken';

export default class Staff extends StaticObject {
    constructor(x, y) {
        super(tiles.staff, 0, x, y, 16, 16);
        this.currentState = StaffState.normal;
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
            const animation = Explosion.explodeAnimationLarge();

            animation.x = this.x;
            animation.y = this.y;

            this.scene.eventManager.subscribe(animation, SceneEvents.detach,
                () => this.currentState = StaffState.broken
            );

            this.scene.attach(animation);

            this.scene.collisionEngine.detach(this);
            this.scene.utils.handleDestroy(event.sourceObject, Explosion.explodeAnimationSmall());
            this.scene.game.keyboard1.detach();
            this.scene.game.keyboard2.detach();
        } else if (event.sourceObject instanceof Tank) {
            this.scene.utils.handleBarrier(event);
        }
    }
}