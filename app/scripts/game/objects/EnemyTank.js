import Tank, {TankDirection} from './Tank';
import tiles from '../tiles';
import Bullet from "./Bullet";
import PlayerTank from "./PlayerTank";

export default class EnemyTank extends Tank {

    constructor(x, y, direction) {
        super(EnemyTank.randomElement([
            tiles.tank.white.normal,
            tiles.tank.white.armored,
            tiles.tank.white.fast,
            tiles.tank.white.power
        ]), x, y, direction);

        this.directionSuggestions = {};
        this.resetSuggestions();
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        super.onAttach(scene);
        this.tickInterval = setInterval(() => this.tick(scene), 40);
        this.autoChangeDirection(scene);
    }

    /**
     * @param {Scene} scene
     */
    onDetach(scene) {
        clearInterval(this.tickInterval);
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
            this.directionSuggestions[this.direction] = 0;
            this.autoChangeDirection(this.scene, event.time);
        }
    }

    /**
     * @param {Scene} scene
     */
    tick(scene) {
        const time = scene.getTime();
        if (Math.random() < 1 / 64 && this.lastDirectionChange + 300 < time) {
            this.autoChangeDirection(scene, time);
        } else if (Math.random() < 1 / 16) {
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

        const direction = EnemyTank.randomElementbyProbabilities(this.directionSuggestions);

        if (this.direction !== direction) {
            this.setSpeed(1, direction);
            this.scene.collisionEngine.checkObject(this, time);
            this.lastDirectionChange = scene.getTime();
        }

        this.resetSuggestions();
    }

    /**
     * @param {Object} arr
     * @returns {String}
     */
    static randomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * @param {Object} arr
     * @returns {String}
     */
    static randomElementbyProbabilities(arr) {

        let keys = [];
        for(let key in arr) {
            keys.push(key);
        }

        const probabilitySum = keys.reduce((sum, key) => {
            return sum + arr[key];
        }, 0);

        if (probabilitySum === 0) {
            return EnemyTank.randomElement(keys);
        }

        const randomValue = Math.random() * probabilitySum;

        let selected = keys[keys.length - 1];

        keys.reduce((sum, key) => {
            const valueSum = sum + arr[key];

            if (randomValue <= valueSum && randomValue >= sum) {
                selected = key;
            }

            return valueSum;
        }, 0);

        return selected;
    }

    resetSuggestions() {
        this.directionSuggestions[TankDirection.up] = 1;
        this.directionSuggestions[TankDirection.down] = 1;
        this.directionSuggestions[TankDirection.left] = 1;
        this.directionSuggestions[TankDirection.right] = 1;
    }
}
