import EnemyTank from "../EnemyTank";
import tiles from "../../tiles";

export default class PowerTank extends EnemyTank {
    constructor(x, y, direction) {
        super(x, y, direction);
        this.tankTile = tiles.tank.white.power;
        this.bulletSpeed = 0.03 * 6;
    }
}