import NormalTank from "./objects/enemy/NormalTank";
import FastTank from "./objects/enemy/FastTank";
import PowerTank from "./objects/enemy/PowerTank";
import ArmoredTank from "./objects/enemy/ArmoredTank";
import {SceneEvents} from "./Scene";
import {TankDirection} from "./objects/Tank";
import Random from "./Random";
import TankBirth from "./objects/TankBirth";
import tiles from "./tiles";

export default class EnemySpawner {
    /**
     * @param {Scene} scene
     * @param total
     * @param sceneTotal
     * @param probabilities
     */
    constructor(scene, total, sceneTotal, probabilities) {
        this.scene = scene;
        this.remain = total;
        this.sceneTotal = sceneTotal;
        this.probabilities = probabilities;
        this.count = 0;

        this.classes = {
            NormalTank: NormalTank,
            FastTank: FastTank,
            PowerTank: PowerTank,
            ArmoredTank: ArmoredTank,
        };

        this.spawnPoints = [
            {x: 0, y: 0},
            {x: 12 * 8, y: 0},
            {x: 24 * 8, y: 0},
        ];

        this.spawnDelay = 2000;
    }

    spawn() {
        for(let i = 0; i < this.sceneTotal; i++) {
            this._autospawn(i * this.spawnDelay);
        }
    }

    _autospawn(delay) {
        this.scene.scheduler.timeout((time, callback) => {
            this.count++;
            this.remain--;

            if (this.remain <= 0) {
                return;
            }

            this._spawn();
            this.scene.scheduler.clearTimeout(callback);
        }, delay);
    }

    _spawn() {
        const spawnPoint = Random.get(this.spawnPoints);
        const tankClass = this.classes[Random.getByProbabilities(this.probabilities)];
        const tank = new tankClass(spawnPoint.x, spawnPoint.y, TankDirection.down);
        tank.setSpeed(1);
        this.scene.attach(new TankBirth(tank, spawnPoint.x, spawnPoint.y));
        this.scene.eventManager.subscribe(tank, SceneEvents.detach, () => this.detachTank());
    }

    /**
     *
     */
    detachTank() {
        this._autospawn(this.spawnDelay);
        this.spawnDelay *= 0.9;
        if (Random.boolean(1 / 10)) {
            this._autospawn(this.spawnDelay);
        }
    }

    renderEnemyIndicator(context, num) {
        const x = num % 2;
        const y = Math.floor(num / 2);

        tiles.gameplay.enemyIndicator.renderSceneFragment(context, 231 + x * 8, 12 + y * 8);
    }

    render(context) {
        for (let i = 0; i < Math.min(this.remain, 20); i++) {
            this.renderEnemyIndicator(context, i);
        }
    }
}
