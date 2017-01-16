import EnemyTank from "../EnemyTank";
import Bullet from "../Bullet";
import tiles from "../../tiles";
import Explosion from "../Explosion";

export default class ArmoredTank extends EnemyTank {
    constructor(x, y, direction) {
        super(x, y, direction);
        this.hardnessTile = {
            3: tiles.tank.green.armored,
            2: tiles.tank.yellow.armored,
            1: tiles.tank.white.armored
        };
        this.hardness = 3;
        this.tankTile = this.hardnessTile[this.hardness];
    }

    /**
     * @param {CollisionEvent} event
     */
    handleCollision(event) {
        if (event.sourceObject instanceof Bullet && event.sourceObject.owner !== this) {
            this.hardness--;
            if (this.hardness > 0) {
                this.tankTile = this.hardnessTile[this.hardness];
                this.scene.utils.handleDestroy(event.sourceObject, Explosion.explodeAnimationSmall());
                return;
            }
        }

        super.handleCollision(event);
    }
}