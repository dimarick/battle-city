import StaticObject from './StaticObject'

export default class OnceObject extends StaticObject {
    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.scene = scene;
        this.lastStateChange = scene.getTime();
        this.currentState = 0;
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param time
     */
    render(context, time) {
        if (this.lastStateChange + this.blinkInterval < time) {
            this.currentState += Math.floor((time - this.lastStateChange) / this.blinkInterval);

            if (this.currentState >= this.tiles.length) {
                this.scene.detach(this);
                return;
            }
            this.lastStateChange = time;
        }

        this.tiles[this.currentState].renderFragment(context, this.x, this.y);
    }
}
