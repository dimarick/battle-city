import EventManager from './event/eventManager';

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

        const that = this;

        function renderLoop() {
            const now = performance.now() - that._start;

            that.render(now);
            that._framecounter++;

            that.animationFrame = requestAnimationFrame(renderLoop)
        }

        // setInterval(renderLoop, 0)
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
        this._context.fillStyle = this._bgColor;
        this._context.fillRect(0, 0, 13*16*3, 13*16*3);

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
}