import Tank, {TankDirection} from './Tank';
import tiles from '../tiles';
import Bullet from "./Bullet";
import Staff, {StaffState} from "./blocks/Staff";
import Water from "./blocks/Water";
import Concrete from "./blocks/Concrete";
import Brick from "./blocks/Brick";
import PlayerTank from "./PlayerTank";

export default class EnemyTank extends Tank {

    constructor(x, y, direction) {
        super(EnemyTank.randomElement([
            tiles.tank.white.normal,
            tiles.tank.white.armored,
            tiles.tank.white.fast,
            tiles.tank.white.power
        ]), x, y, direction);

        this.previousDirection = direction;
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

        if (object instanceof Staff && object.currentState !== StaffState.broken) {
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

        if (this.throwOnCollision === true) {
            throw new Error('collision_not_allowed')
        }

        if (event.sourceObject === this) {
            this.autoChangeDirection(this.scene);
        }
    }

    /**
     * @param {Scene} scene
     */
    tick(scene) {
        if (Math.random() < 1 / 64 && this.lastDirectionChange + 1000 < scene.getTime()) {
            this.autoChangeDirection(scene);
        } else if (Math.random() < 1 / 16) {
            this.fire();
        }
    }

    /**
     * @param {Scene} scene
     * @param suggestDirections
     */
    autoChangeDirection(scene, suggestDirections) {
        if (suggestDirections === undefined) {
            suggestDirections = [];
            if (Math.round(this.x) % 8 === 0) {
                suggestDirections = suggestDirections.concat([TankDirection.up, TankDirection.down]);
            }
            if (Math.round(this.y) % 8 === 0) {
                suggestDirections = suggestDirections.concat([TankDirection.left, TankDirection.right]);
            }
            if (this.xSpeed !== 0) {
                suggestDirections = suggestDirections.concat([TankDirection.up, TankDirection.down]);
            }
            if (this.ySpeed !== 0) {
                suggestDirections = suggestDirections.concat([TankDirection.left, TankDirection.right]);
            }
            suggestDirections = suggestDirections.concat([TankDirection.down]);
        }

        const currentDirection = this.direction;

        const direction = EnemyTank.randomElement(suggestDirections.filter((direction) => {
            return currentDirection !== direction;
        }));

        if (currentDirection !== direction) {
            this.throwOnCollision = true;
            try {
                const now = this.scene.getTime();
                this.setSpeed(1, direction);
                this.scene.collisionEngine.checkObject(this, now);
                this.lastDirectionChange = scene.getTime();
            } catch (e) {
                if (e.message === 'collision_not_allowed') {
                    this.autoChangeDirection(scene, suggestDirections.filter((a) => {return direction !== a}));
                }
            }
            this.throwOnCollision = false;
        }
    }

    static randomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
