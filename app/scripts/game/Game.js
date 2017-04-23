import Scene from './Scene';
import DebugInfo from './objects/DebugInfo';
import {TankDirection} from './objects/Tank';
import PlayerTank from './objects/PlayerTank';
import Keyboard from './input/Keyboard';
import Commands from './input/Commands';
import PlayerTankBirth from './objects/PlayerTankBirth';
import StageMap, {mapStage1} from './objects/StageMap';
import tiles from './tiles';
import Staff from "./objects/blocks/Staff";
import EnemyTank from "./objects/EnemyTank";
import TankBirth from "./objects/TankBirth";
import EnemySpawner from "./EnemySpawner";

export default class Game
{
    /**
     * @param {CanvasRenderingContext2D} context
     */
    constructor(context) {
        this._context = context;
    }

    start() {
        const scene = this._scene = new Scene(this, this._context);

        scene.attach(new Staff(6*16, 12*16));

        const map = new StageMap(mapStage1);
        map.attach(scene);

        this.keyboardGeneral = new Keyboard({
            19: Commands.pause,
            109: Commands.speedDown,
            107: Commands.speedUp
        }, scene.eventManager);

        this.keyboardGeneral.attach(this);

        scene.eventManager.subscribe(this, Commands.pause.start, () => this.commandPause(scene));
        scene.eventManager.subscribe(this, Commands.speedDown.start, () => this.commandSpeedDown(scene));
        scene.eventManager.subscribe(this, Commands.speedUp.start, () => this.commandSpeedUp(scene));

        this.keyboard1 = new Keyboard({
            38: Commands.up,
            40: Commands.down,
            37: Commands.left,
            39: Commands.right,
            96: Commands.fire,
            19: Commands.pause
        }, scene.eventManager);

        this.keyboard2 = new Keyboard({
            87: Commands.up,
            83: Commands.down,
            65: Commands.left,
            68: Commands.right,
            32: Commands.fire
        }, scene.eventManager);

        this.spawnPlayer1(scene);
        this.spawnPlayer2(scene);

        this.enemySpawner = new EnemySpawner(this._scene, 20, 6, {
            NormalTank: 3,
            FastTank: 2,
            PowerTank: 2,
            ArmoredTank: 1.5,
        });

        this.enemySpawner.spawn();
    }

    /**
     * @param {Scene} scene
     */
    commandPause(scene) {
        if (!scene.isSuspended()) {
            scene.suspend();
        } else {
            scene.resume();
        }
    }

    /**
     * @param {Scene} scene
     */
    spawnPlayer1(scene) {
        const score = this.player1 !== undefined ? this.player1.score : 0;
        this.player1 = new PlayerTank(tiles.tank.yellow, 8 * 8, 24 * 8, TankDirection.up);
        this.player1.score = score;
        this.keyboard1.attach(this.player1);
        scene.attach(new PlayerTankBirth(this.player1, this.player1.x, this.player1.y));
    }

    /**
     * @param {Scene} scene
     */
    spawnPlayer2(scene) {
        const score = this.player2 !== undefined ? this.player2.score : 0;
        this.player2 = new PlayerTank(tiles.tank.green, 16 * 8, 24 * 8, TankDirection.up);
        this.player2.score = score;
        this.keyboard2.attach(this.player2);
        scene.attach(new PlayerTankBirth(this.player2, this.player2.x, this.player2.y));
    }

    spawnEnemy(scene) {
        this.enemyCount++;
        if (this.enemyCount >= this.enemyMaxCount) {
            return;
        }
        const spawnPoint = Math.floor(Math.random() * 13) * 16;
        const tank = new EnemyTank(spawnPoint, 0, TankDirection.down);
        tank.setSpeed(1);
        scene.attach(new TankBirth(tank, spawnPoint, 0));
    }

    autoRespawn(scene, object) {
        if (scene.game.player1 === object) {
            scene.game.spawnPlayer1(scene);
        } else if (scene.game.player2 === object) {
            scene.game.spawnPlayer2(scene);
        }
    }

    showDebug(show)
    {
        if (show === true && this.debugInfo === undefined) {
            this.debugInfo = new DebugInfo();
            this._scene.attach(this.debugInfo);
        } else if (this.debugInfo !== undefined) {
            this._scene.detach(this.debugInfo);
            this.debugInfo = undefined;
        }
    }

    restart() {
        this._scene.destroy();
        delete this._scene;
        this.start();
        if (this.debugInfo !== undefined) {
            this.debugInfo = undefined;
            this.showDebug(true);
        }
    }

    /**
     * @param {Scene} scene
     */
    commandSpeedUp(scene) {
        scene.timeScale /= 0.9;
    }

    /**
     * @param {Scene} scene
     */
    commandSpeedDown(scene) {
        scene.timeScale *= 0.9;
    }
}