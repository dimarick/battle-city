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

        this.keyboard1 = new Keyboard({
            38: Commands.up,
            40: Commands.down,
            37: Commands.left,
            39: Commands.right,
            96: Commands.fire
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

        this.enemySpawner = new EnemySpawner(this._scene, 20, 4, {
            NormalTank: 1,
            FastTank: 1,
            PowerTank: 1,
            ArmoredTank: 1,
        });

        this.enemySpawner.spawn();
    }

    /**
     * @param {Scene} scene
     */
    spawnPlayer1(scene) {
        this.player1 = new PlayerTank(tiles.tank.yellow, 8 * 8, 24 * 8, TankDirection.up);
        this.keyboard1.attach(this.player1);
        scene.attach(new PlayerTankBirth(this.player1, this.player1.x, this.player1.y));
    }

    /**
     * @param {Scene} scene
     */
    spawnPlayer2(scene) {
        this.player2 = new PlayerTank(tiles.tank.green, 16 * 8, 24 * 8, TankDirection.up);
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
}