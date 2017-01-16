import EnemyTank from "../EnemyTank";
import tiles from "../../tiles";

export default class NormalTank extends EnemyTank {
    constructor(x, y, direction) {
        super(x, y, direction);
        this.tankTile = tiles.tank.white.normal;
    }
}