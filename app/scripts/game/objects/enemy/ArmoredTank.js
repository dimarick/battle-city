import EnemyTank from "../EnemyTank";
import Bullet from "../Bullet";
import tiles from "../../tiles";
import Explosion from "../Explosion";
import PlayerTank from "../PlayerTank";

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
        this.cost = 400;
    }

    /**
     * @param {CollisionEvent} event
     */
    handleCollision(event) {
        if (event.sourceObject instanceof Bullet && event.sourceObject.owner instanceof PlayerTank) {
            if (this.hardness > 1) {
                this.hardness--;
                this.tankTile = this.hardnessTile[this.hardness];
                this.scene.utils.handleDestroy(event.sourceObject, Explosion.explodeAnimationSmall());
                return;
            }
        }

        for (let target of event.targetObject) {
            if (target instanceof Bullet && target.owner instanceof PlayerTank) {
                if (this.hardness > 1) {
                    this.hardness--;
                    this.tankTile = this.hardnessTile[this.hardness];
                    this.scene.utils.handleDestroy(target, Explosion.explodeAnimationSmall());
                    return;
                }
            }
        }

        super.handleCollision(event);
    }
}