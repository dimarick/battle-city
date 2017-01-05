import DynamicObject from './DynamicObject';
import Explosion from './Explosion';
import StaticObject from './StaticObject';
import {CollisionEvent} from '../collision/CollisionEngine';
import tiles from '../tiles';

export default class Bullet extends DynamicObject {
    constructor(x, y, xSpeed, ySpeed) {
        super();
        if (xSpeed !== 0) {
            this.x = x;
            this.y = y - 2;
        } else if (ySpeed !== 0) {
            this.x = x - 2;
            this.y = y;
        }

        this.width = this.height = 4;

        this.setVector(0.04 * 3 * xSpeed, 0.04 * 3 * ySpeed)
    }

    getBangX() {
        if (this.xSpeed > 0) {
            return this.x + 4;
        } else if (this.xSpeed < 0) {
            return this.x;
        } else if (this.ySpeed !== 0) {
            return this.x + 2;
        }
    }

    getBangY() {
        if (this.ySpeed > 0) {
            return this.y + 4;
        } else if (this.ySpeed < 0) {
            return this.y;
        } else if (this.xSpeed !== 0) {
            return this.y + 2;
        }
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.scene = scene;
        this.updateTime = scene.getTime();

        this.scene.collisionEngine.attachDynamic(this);
        this.scene.collisionEngine.check(this, this.updateTime);
        this.scene.eventManager.subscribe(this, CollisionEvent.contact, (object, event) => this.onContact(event));
    }

    /**
     * @param {CollisionEvent} event
     */
    onContact(event) {
        this.updatePosition(event.time);

        if (event.allowedX !== undefined) {
            this.x = event.allowedX;
        }

        if (event.allowedY !== undefined) {
            this.y = event.allowedY;
        }

        event.targetObject.forEach((target) => {
            if (target.handleBullet !== undefined) {
                target.handleBullet(this, event);
            }
        });

        this.scene.detach(this);
        this.scene.attach(new Explosion(new StaticObject([], 0, this.getBangX() / 8 - 1, this.getBangY() / 8 - 1, 2, 2), undefined, 1));
    }

    /**
     * @param {Scene} scene
     */
    onDetach(scene) {
        scene.collisionEngine.detach(this);
    }


    render(context, time) {
        this.updatePosition(time);

        const tile = this._getDirectionTile();

        tile.renderFragment(context, this.x, this.y);
    }


    /**
     * @returns {TankStateTileRegistry}
     * @private
     */
    _getDirectionTile() {
        if (this.ySpeed < 0) {
            return tiles.bullet.up;
        } else if (this.ySpeed > 0) {
            return tiles.bullet.down;
        } else if (this.xSpeed < 0) {
            return tiles.bullet.left;
        } else if (this.xSpeed > 0) {
            return tiles.bullet.right;
        }
    }
}