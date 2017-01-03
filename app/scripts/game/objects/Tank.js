import DynamicObject from './DynamicObject';

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
        this.direction = direction;
    }

    setPosition(x, y) {
        this.x = x * 8;
        this.y = y * 8;
    }

    setSpeed(speed, direction) {
        if (direction !== undefined) {
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
        const tile = Math.floor(this.x + this.y) % 2 === 0 ? directionTile.odd : directionTile.even;

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
}