export default class StaticObject {

    /**
     * @param {Tile[]} tiles
     * @param {int} blinkInterval ms
     * @param {int} x
     * @param {int} y
     */
    constructor(tiles, blinkInterval, x, y)
    {
        this.tiles = tiles;
        this.blinkInterval = blinkInterval;
        this.x = x;
        this.y = y;

        this.lastStateChange = 0;
        this.currentState = 0;
    }

    render(context, time) {
        if (this.lastStateChange + this.blinkInterval < time) {
            this.currentState++;
            if (this.currentState >= this.tiles.length) {
                this.currentState = 0;
            }
            this.lastStateChange = time;
        }

        this.tiles[this.currentState].renderFragment(context, this.x * 8, this.y * 8);
    }
}
