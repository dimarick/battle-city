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

        scene.attach(new Staff(6*2, 12*2));

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

        setInterval(() => {
            const spawnPoint = Math.floor(Math.random() * 13) * 2;
            scene.attach(new TankBirth(new EnemyTank(spawnPoint, 0, TankDirection.down), spawnPoint, 0));
        }, 500);
    }

    /**
     * @param {Scene} scene
     */
    spawnPlayer1(scene) {
        this.player1 = new PlayerTank(tiles.tank.yellow, 8, 24, TankDirection.up);
        this.keyboard1.attach(this.player1);
        scene.attach(new PlayerTankBirth(this.player1, this.player1.x / 8, this.player1.y / 8));
    }

    /**
     * @param {Scene} scene
     */
    spawnPlayer2(scene) {
        this.player2 = new PlayerTank(tiles.tank.green, 16, 24, TankDirection.up);
        this.keyboard2.attach(this.player2);
        scene.attach(new PlayerTankBirth(this.player2, this.player2.x / 8, this.player2.y / 8));
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