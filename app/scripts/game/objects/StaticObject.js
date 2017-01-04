export default class StaticObject {

    /**
     * @param {Tile[]} tiles
     * @param {int} blinkInterval ms
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     */
    constructor(tiles, blinkInterval, x, y, width, height)
    {
        this.tiles = tiles;
        this.blinkInterval = blinkInterval;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.lastStateChange = 0;
        this.currentState = 0;
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        if (this.width !== undefined && this.height !== undefined) {
            scene.collisionEngine.attachStatic(this);
        }
    }

    render(context, time) {
        if (this.lastStateChange + this.blinkInterval < time && this.blinkInterval) {
            this.currentState = (this.currentState + Math.floor((time - this.lastStateChange) / this.blinkInterval)) % this.tiles.length;
            this.lastStateChange = time;
        }

        this.tiles[this.currentState].renderFragment(context, this.x * 8, this.y * 8);
    }
}
