import DynamicObject from './DynamicObject';
import {CollisionEvent} from '../collision/CollisionEngine';

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
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.scene = scene;
        scene.eventManager.subscribe(this, CollisionEvent.contact, this.onContact, this);
        scene.collisionEngine.attachDynamic(this);
    }

    /**
     * @param {Tank} object
     * @param {CollisionEvent} event
     */
    onContact(object, event) {
        this.updatePosition(event.time);
        console.log(this, event);

        if (event.allowedX !== undefined) {
            this.x = event.allowedX;
        }

        if (event.allowedY !== undefined) {
            this.y = event.allowedY;
        }
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

    render(context, time) {
        this.updatePosition(time);

        const directionTile = this._getDirectionTile();
        const tile = Math.floor(time / 60 * (this.xSpeed + this.ySpeed ? 1 : 0)) % 2 === 0 ? directionTile.odd : directionTile.even;

        tile.renderFragment(context, this.x, this.y);
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
}