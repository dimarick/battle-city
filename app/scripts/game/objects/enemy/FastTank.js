import EnemyTank from "../EnemyTank";
import tiles from "../../tiles";

export default class FastTank extends EnemyTank {
    constructor(x, y, direction) {
        super(x, y, direction);
        this.tankTile = tiles.tank.white.fast;
        this.baseSpeed = 0.03 * 2;
    }
}