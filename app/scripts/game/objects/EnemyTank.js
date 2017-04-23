import Tank, {TankDirection} from './Tank';
import Bullet from "./Bullet";
import PlayerTank from "./PlayerTank";
import Random from "../Random";
import Brick from "./blocks/Brick";
import Staff from "./blocks/Staff";
import EventManager from "../event/EventManager";

export default class EnemyTank extends Tank {

    constructor(x, y, direction) {
        super(x, y, direction);

        this.directionSuggestions = {};
        this.baseSpeed = 0.03;
        this.bulletSpeed = 0.03 * 3;
        this.resetSuggestions();
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        super.onAttach(scene);
        this.tickInterval = scene.scheduler.timeout((time) => this.tick(scene, time), 40);
        this.autoChangeDirection(scene);
    }

    /**
     * @param {Scene} scene
     */
    onDetach(scene) {
        scene.scheduler.clearTimeout(this.tickInterval);
    }

    supportsDynamicCollision(object) {
        if (object instanceof PlayerTank) {
            return true;
        }

        if (object instanceof EnemyTank) {
            return true;
        }

        if (object instanceof Bullet && object.owner instanceof PlayerTank) {
            return true;
        }

        return false;
    }

    /**
     * @param {CollisionEvent} event
     */
    handleCollision(event) {
        super.handleCollision(event);

        if (event.sourceObject === this) {
            if (Random.boolean(0.1) && this.canDestroy(event.targetObject)) {
                this.fire();
                this.lastDirectionChange = event.time;
            } else {
                this.directionSuggestions[this.direction] = 0;
                this.autoChangeDirection(this.scene, event.time);

                return EventManager.eventProcessed;
            }
        }
    }

    /**
     * @param {Scene} scene
     * @param {number} time
     */
    tick(scene, time) {
        if (Random.boolean(1 / 64) && this.lastDirectionChange + 300 < time) {
            this.autoChangeDirection(scene, time);
        }

        if (Random.boolean(1 / 16)) {
            this.fire();
        }
    }

    /**
     * @param {Scene} scene
     * @param {int} time
     */
    autoChangeDirection(scene, time) {
        if (Math.round(this.x) % 8 === 0) {
            this.directionSuggestions[TankDirection.up] *= 4;
            this.directionSuggestions[TankDirection.down] *= 4;
        }
        if (Math.round(this.y) % 8 === 0) {
            this.directionSuggestions[TankDirection.left] *= 4;
            this.directionSuggestions[TankDirection.right] *= 4;
        }
        if (this.xSpeed !== 0) {
            this.directionSuggestions[TankDirection.up] *= 4;
            this.directionSuggestions[TankDirection.down] *= 4;
        }
        if (this.ySpeed !== 0) {
            this.directionSuggestions[TankDirection.left] *= 4;
            this.directionSuggestions[TankDirection.right] *= 4;
        }

        this.directionSuggestions[this.direction] *= 2;

        const direction = Random.getByProbabilities(this.directionSuggestions);

        if (this.direction !== direction) {
            this.setSpeed(1, direction);
            this.scene.collisionEngine.checkObject(this, time);
            this.lastDirectionChange = scene.getTime();
        }

        this.resetSuggestions();
    }

    resetSuggestions() {
        this.directionSuggestions[TankDirection.up] = 1;
        this.directionSuggestions[TankDirection.down] = 1;
        this.directionSuggestions[TankDirection.left] = 1;
        this.directionSuggestions[TankDirection.right] = 1;
    }

    /**
     * @param {Array} objects
     */
    canDestroy(objects) {
        for (let object of objects) {
            if (
                object instanceof Brick ||
                object instanceof Staff ||
                object instanceof PlayerTank
            ) {
                return true;
            }
        }

        return false;
    }
}
