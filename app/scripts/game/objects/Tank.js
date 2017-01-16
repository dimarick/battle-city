import DynamicObject from './DynamicObject';
import Bullet from './Bullet';
import {SceneEvents} from '../Scene';
import {CollisionEvent} from '../collision/CollisionEngine';
import Explosion from './Explosion';

export class TankDirection {}
TankDirection.up = 'up';
TankDirection.down = 'down';
TankDirection.left = 'left';
TankDirection.right = 'right';

export default class Tank extends DynamicObject {
    /**
     * @param x
     * @param y
     * @param {string} direction
     */
    constructor(x, y, direction) {
        super();
        this.width = 16;
        this.height = 16;
        this.maxBullets = 1;
        this.bullets = new Set;
        this.detached = true;
        this.baseSpeed = 0.04;
        this.bulletSpeed = 0.04 * 3;
        this.bulletClass = Bullet;
        this.setPosition(x, y);
        this.setSpeed(0, direction);
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.scene = scene;
        this.detached = false;
        scene.collisionEngine.attachDynamic(this);
        scene.eventManager.subscribe(this, CollisionEvent.contact, (object, event) => this.handleCollision(event));
    }

    /**
     * @param {CollisionEvent} event
     */
    handleCollision(event) {
        for (let target of event.targetObject) {
            if (event.sourceObject instanceof Bullet && event.sourceObject.owner !== this) {
                this.handleBullet(event.sourceObject);
            } else if (target instanceof Bullet && target.owner !== this) {
                this.handleBullet(target);
            } else if (event.sourceObject instanceof Tank) {
                this.scene.utils.handleBarrier(event);
            }
        }
    }

    handleBullet(bullet) {
        const animation = Explosion.explodeAnimationLarge();

        animation.x = this.x;
        animation.y = this.y;

        this.scene.utils.handleDestroy(bullet, Explosion.explodeAnimationSmall());

        this.scene.collisionEngine.detach(this);
        this.scene.detach(this);
        this.scene.attach(animation);
        this.scene.eventManager.subscribe(animation, SceneEvents.detach, () => this.scene.game.autoRespawn(this.scene, this));
    }

    onDetach(scene) {
        this.detached = true;
        scene.collisionEngine.detach(this);
    }

    changeDirection(speed, direction) {
        const now = this.scene.getTime();
        this.updatePosition(this.scene.getTime());
        this.scene.collisionEngine.checkObject(this, now);
        this.setSpeed(speed, direction);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSpeed(speed, direction) {
        if (direction !== undefined) {
            if (this._isRotates(this.direction, direction)) {
                this.x = Math.round(this.x / 8) * 8;
                this.y = Math.round(this.y / 8) * 8;
            }

            this.direction = direction;
        }

        switch (this.direction) {
            case TankDirection.up:
                this.setVector(0, -this.baseSpeed * speed);
                break;
            case TankDirection.down:
                this.setVector(0, this.baseSpeed * speed);
                break;
            case TankDirection.left:
                this.setVector(-this.baseSpeed * speed, 0);
                break;
            case TankDirection.right:
                this.setVector(this.baseSpeed * speed, 0);
                break;
        }
    }

    fire() {
        if (this._canFire()) {
            // Run collision detection for case when tank must be already destroyed
            this.scene.collisionEngine.check(this.scene.getTime());

            if (this.detached) {
                return;
            }

            const bullet = this._getBullet();
            this.scene.eventManager.subscribe(bullet, SceneEvents.detach, (object) => setTimeout(() => this.finishFire(object), 200));

            this.scene.attach(bullet);
            this.bullets.add(bullet);
        }
    }

    finishFire(object) {
        this.bullets.delete(object);
    }

    render(context, time) {
        this.updatePosition(time);

        const directionTile = this._getDirectionTile();
        const tile = Math.floor(time / 60 * (this.xSpeed + this.ySpeed ? 1 : 0)) % 2 === 0 ? directionTile.odd : directionTile.even;

        tile.renderFragment(context, this.x, this.y);
    }

    _getBullet() {
        switch (this.direction) {
            case TankDirection.up:
                return new this.bulletClass(this, this.x + this.width / 2, this.y, 0, -1, this.bulletSpeed);
                break;
            case TankDirection.down:
                return new this.bulletClass(this, this.x + this.width / 2, this.y + this.height - 4, 0, 1, this.bulletSpeed);
                break;
            case TankDirection.left:
                return new this.bulletClass(this, this.x, this.y + this.height / 2, -1, 0, this.bulletSpeed);
                break;
            case TankDirection.right:
                return new this.bulletClass(this, this.x + this.width - 4, this.y + this.height / 2, 1, 0, this.bulletSpeed);
                break;
        }
    }

    /**
     * @returns {TankStateTileRegistry}
     * @private
     */
    _getDirectionTile() {
        switch (this.direction) {
            case TankDirection.up:
                return this.tankTile.up;
            case TankDirection.down:
                return this.tankTile.down;
            case TankDirection.left:
                return this.tankTile.left;
            case TankDirection.right:
                return this.tankTile.right;
        }
    }

    /**
     * @param directionFrom
     * @param directionTo
     * @private
     */
    _isRotates(directionFrom, directionTo) {
        if (
            (directionFrom === TankDirection.up || directionFrom === TankDirection.down) &&
            (directionTo === TankDirection.left || directionTo === TankDirection.right)
        ) {
            return true;
        }

        //noinspection RedundantIfStatementJS
        if (
            (directionTo === TankDirection.up || directionTo === TankDirection.down) &&
            (directionFrom === TankDirection.left || directionFrom === TankDirection.right)
        ) {
            return true;
        }

        return false;
    }

    _canFire() {
        return this.bullets.size < this.maxBullets;
    }
}