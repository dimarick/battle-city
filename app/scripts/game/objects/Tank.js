import DynamicObject from './DynamicObject';
import Bullet from './Bullet';
import {SceneEvents} from '../Scene';

export class TankDirection {}
TankDirection.up = 'up';
TankDirection.down = 'down';
TankDirection.left = 'left';
TankDirection.right = 'right';

export default class Tank extends DynamicObject {
    /**
     * @param {TankDirectionTileRegistry} tankTile
     * @param x
     * @param y
     * @param {string} direction
     */
    constructor(tankTile, x, y, direction) {
        super();
        this.tankTile = tankTile;
        this.setPosition(x, y);
        this.setSpeed(0, direction);
        this.width = 16;
        this.height = 16;
        this.maxBullets = 2;
        this.bullets = new Set;
        this.detached = true;
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.scene = scene;
        this.detached = false;
        scene.collisionEngine.attachDynamic(this);
    }

    onDetach() {
        this.detached = true;
    }

    changeDirection(speed, direction) {
        const now = this.scene.getTime();
        this.updatePosition(this.scene.getTime());
        this.scene.collisionEngine.checkObject(this, now);
        this.setSpeed(speed, direction);
    }

    setPosition(x, y) {
        this.x = x * 8;
        this.y = y * 8;
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
                this.setVector(0, -0.04 * speed);
                break;
            case TankDirection.down:
                this.setVector(0, 0.04 * speed);
                break;
            case TankDirection.left:
                this.setVector(-0.04 * speed, 0);
                break;
            case TankDirection.right:
                this.setVector(0.04 * speed, 0);
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
            this.scene.attach(bullet);
            this.bullets.add(bullet);
            this.scene.eventManager.subscribe(bullet, SceneEvents.detach, (object) => setTimeout(() => this.finishFire(object), 200));
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
                return new Bullet(this.x + 8, this.y, 0, -1);
                break;
            case TankDirection.down:
                return new Bullet(this.x + 8, this.y + this.height, 0, 1);
                break;
            case TankDirection.left:
                return new Bullet(this.x, this.y + 8, -1, 0);
                break;
            case TankDirection.right:
                return new Bullet(this.x + this.width, this.y + 8, 1, 0);
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