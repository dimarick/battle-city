export default class DebugInfo
{
    constructor() {
        this.prevTime = 0;
        this.frames = 0;
        this.fps = 0;
        this.time = 0;
    }
    /**
     * @param {CanvasRenderingContext2D} context
     * @param time
     */
    render(context, time) {
        if ((time - 300) > this.prevTime) {
            this.fps = 1000 * this.frames / (time - this.prevTime);
            this.time = time;
            this.prevTime = time;
            this.frames = 0;
        }

        this.frames++;

        context.fillStyle = "#FFF";
        context.font = '20pt Arial';
        context.textBaseline = "top";
        context.fillText((Math.round(this.time * 1000) / 1000) + " ms", 5, 5, 180, 832);
        context.fillText((Math.round(this.fps * 1000) / 1000) + " fps", 5, 40, 150, 832);
    }
}
