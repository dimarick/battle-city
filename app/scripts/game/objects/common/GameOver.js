import tiles from '../../tiles';
import StaticObject from "../StaticObject";

export default class GameOver extends StaticObject {
    constructor() {
        super([tiles.gameplay.gameOver], 0, 88, 208, 32, 16)
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.time = scene.getTime();
    }

    render(context, time) {
        const timeFromEnd = time - this.time;
        this.y = Math.max(0, 4000 - timeFromEnd) / (4000 / (233 - 104)) + 104;

        super.render(context, time);
    }
}