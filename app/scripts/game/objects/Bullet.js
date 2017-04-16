import DynamicObject from './DynamicObject';
import {CollisionEvent} from '../collision/CollisionEngine';
import tiles from '../tiles';

export default class Bullet extends DynamicObject {
    constructor(owner, x, y, xSpeed, ySpeed, baseSpeed) {
        super();

        this.owner = owner;

        if (xSpeed !== 0) {
            this.x = x;
            this.y = y - 2;
        } else if (ySpeed !== 0) {
            this.x = x - 2;
            this.y = y;
        }

        this.width = this.height = 4;
        this.baseSpeed = baseSpeed;

        this.setVector(this.baseSpeed * xSpeed, this.baseSpeed * ySpeed)
    }

    getBaseX() {
        if (this.xSpeed > 0) {
            return this.x + 4;
        } else if (this.xSpeed < 0) {
            return this.x;
        } else if (this.ySpeed !== 0) {
            return this.x + 2;
        }
    }

    getBaseY() {
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
        this.scene.collisionEngine.checkObject(this, this.updateTime);
        scene.eventManager.subscribe(this, CollisionEvent.contact, (object, event) => this.handleCollision(event));
    }

    /**
     * @param {CollisionEvent} event
     */
    handleCollision(event) {
        event.targetObject.forEach((object) => {
            if (object instanceof Bullet && event.sourceObject instanceof Bullet && object.owner !== event.sourceObject.owner) {
                this.scene.detach(object);
                this.scene.detach(event.sourceObject);
            }
        });
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
     * @returns {Tile}
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