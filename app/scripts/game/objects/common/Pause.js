import tiles from '../../tiles';
import StaticObject from "../StaticObject";

export default class Pause extends StaticObject {
    constructor() {
        super([tiles.gameplay.pause, tiles.null], 700, 84, 100, 40, 8)
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.time = performance.now();
    }

    render(context) {
        const time = performance.now() - this.time;

        if ((Math.floor(time / this.blinkInterval) % 2) === 0) {
            tiles.gameplay.pause.renderFragment(context, this.x, this.y);
        }
    }
}