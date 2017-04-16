export default class DebugInfo
{
    constructor() {
        this.prevTime = 0;
        this.frames = 0;
        this.fps = 0;
        this.time = 0;

        this.prevStat = [{
            objects: {
                stat: 0,
                dyn: 0
            },
            fullScan: 0,
            objectScan: 0,
            pairScan: 0,
            events: 0
        }];
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.scene = scene;
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param time
     */
    render(context, time) {
        if ((time - 300) > this.prevTime) {
            this.prevTime = this.time;
            this.time = time;
            this.fps = this.frames;
            this.frames = 0;
            this.prevStat.push(Object.assign({}, this.scene.collisionEngine.stat));
            this.prevStat = this.prevStat.slice(-10, 10);
        }

        this.frames++;

        const interval = this.time - this.prevTime;

        this.renderText(context,
"\
" + "P1 " + this.scene.game.player1.score + ", P2 " + this.scene.game.player2.score + " E " + this.scene.game.enemySpawner.remain + "\n\
" + (Math.round(this.time * 1000) / 1000) + "\tms\n\
" + this._getRate(this.fps, interval, 1000) + "\tfps\n\
" + this.scene.collisionEngine.stat.objects.stat + "\tстат\n\
" + this.scene.collisionEngine.stat.objects.dyn + "\tдин\n\
" + this._getRate(this.prevStat[this.prevStat.length - 1].fullScan - this.prevStat[0].fullScan, interval * 10 / (this.fps / interval), 1) + "\tполных\n\
" + this._getRate(this.prevStat[this.prevStat.length - 1].objectScan - this.prevStat[0].objectScan, interval * 10 / (this.fps / interval), 1) + "\tобъектов\n\
" + this._getRate(this.prevStat[this.prevStat.length - 1].pairScan - this.prevStat[0].pairScan, interval * 10 / (this.fps / interval), 1) + "\tпар\n\
" + this._getRate(this.prevStat[this.prevStat.length - 1].events - this.prevStat[0].events, interval * 10 / (this.fps / interval), 1) + "\tсобытий\n\
");
    }

    _getRate(count, interval, round) {
        return Math.round(1000 * count / interval * round) / round;
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {string} text
     */
    renderText(context, text) {
        let top = 0;

        context.fillStyle = "#FFF";
        context.strokeStyle = "#000";
        context.font = '16pt Arial';
        context.textBaseline = "top";
        context.textAlign = "right";

        text.split("\n").forEach((row) => {
            context.font = 'normal 16pt Arial';
            context.fillStyle = "#FFF";
            context.fillText(row, 185, 5 + top, 180, 832);
            top += 25;
        });
    }
}
