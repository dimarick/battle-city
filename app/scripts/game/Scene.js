import EventManager from './event/EventManager';
import CollisionEngine from './collision/CollisionEngine';

export class SceneEvents {}
SceneEvents.attach = 'scene.attach';
SceneEvents.detach = 'scene.detach';

export default class Scene
{
    constructor(context, bgColor) {
        this._context = context;
        this._bgColor = bgColor;
        this._objects = new Map;
        this._start = performance.now();
        this._framecounter = 0;
        this.eventManager = new EventManager();
        this.collisionEngine = new CollisionEngine(this, 1000 / 120);
        this.width = 13*16;
        this.height = 13*16;

        const that = this;

        function renderLoop() {
            const now = that.getTime();

            that.render(now);
            that._framecounter++;

            that.animationFrame = requestAnimationFrame(renderLoop)
        }

        // setInterval(renderLoop, 2000);
        renderLoop();
    }

    attach(object) {
        this._objects.set(object, object);

        if (object.onAttach !== undefined) {
            object.onAttach(this);
        }

        this.eventManager.dispatch(object, SceneEvents.attach, {scene: this});
    }

    detach(object) {
        if (!this._objects.has(object)) {
            return;
        }

        if (object.onDetach !== undefined) {
            object.onDetach(this);
        }

        this.eventManager.dispatch(object, SceneEvents.detach, {scene: this});

        this._objects.delete(object);
    }

    render(time) {
        this.collisionEngine.check(time);

        this._context.fillStyle = this._bgColor;
        this._context.fillRect(0, 0, this.width * 3, this.height * 3);

        this._objects.forEach((object) => {
            object.render(this._context, time)
        })
    }

    destroy() {
        cancelAnimationFrame(this.animationFrame);

        this._objects.forEach((object) => {
            this.detach(object);
        });
    }

    getTime() {
        return performance.now() - this._start;
    }
}