import EventManager from './event/EventManager';
import CollisionEngine, {CollisionEvent} from './collision/CollisionEngine';
import SceneUtils from './scene/SceneUtils';
import Tank from './objects/Tank';
import Bullet from './objects/Bullet';
import Explosion from './objects/Explosion';
import Scheduler from './Scheduler';

export class SceneEvents {}
SceneEvents.attach = 'scene.attach';
SceneEvents.detach = 'scene.detach';

export default class Scene
{
    /**
     * @param {Game} game
     * @param {CanvasRenderingContext2D} context
     */
    constructor(game, context) {
        this.game = game;
        this._context = context;
        this._objects = new Set;
        this._start = performance.now();
        this._framecounter = 0;
        this.eventManager = new EventManager();
        this.eventManager.subscribe(this, CollisionEvent.contact, (object, event) => this.handleCollision(event));
        this.collisionEngine = new CollisionEngine(this, 1000 / 120);
        this.utils = new SceneUtils(this);
        this.width = 13*16;
        this.height = 13*16;
        this.scheduler = new Scheduler(this);
        this.timeScale = 1;

        const that = this;

        function renderLoop() {
            const now = that.getTime();

            that.render(now);
            that._framecounter++;

            that.animationFrame = requestAnimationFrame(renderLoop)
        }

        renderLoop();
    }

    attach(object) {
        this._objects.add(object);

        if (object.onAttach !== undefined) {
            object.onAttach(this);
        }

        this.eventManager.dispatch(object, SceneEvents.attach, {scene: this});
    }

    detach(object) {
        if (!this._objects.has(object)) {
            return false;
        }

        if (object.onDetach !== undefined) {
            object.onDetach(this);
        }

        this.eventManager.dispatch(object, SceneEvents.detach, {scene: this});

        this._objects.delete(object);

        return true;
    }

    /**
     * @param {CollisionEvent} event
     */
    handleCollision(event) {
        if (event.sourceObject instanceof Bullet) {
            this.utils.handleDestroy(event.sourceObject, Explosion.explodeAnimationSmall());
        } else if (event.sourceObject instanceof Tank) {
            this.utils.handleBarrier(event);
        }
    }

    render(time) {
        this.scheduler.dispatch(time);
        this.collisionEngine.check(time);

        this._context.fillStyle = 'black';
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

    /**
     * @returns {number}
     */
    _getTime() {
        if (this.isSuspended()) {
            return this._suspendedAt;
        }

        return performance.now() - this._start;
    }

    /**
     * TODO: move out all time control to {Game}
     * @returns {number}
     */
    getTime() {
        return this._getTime() * this.timeScale;
    }

    /**
     * @returns {boolean}
     */
    isSuspended() {
        return this._suspendedAt !== undefined;
    }

    /**
     *
     */
    suspend() {
        this._suspendedAt = this._getTime();
        this.render(this.getTime());
    }

    /**
     *
     */
    resume() {
        this._start += performance.now() - this._start - this._suspendedAt;
        delete this._suspendedAt;
    }
}