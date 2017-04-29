import Scene from './Scene';
import DebugInfo from './objects/DebugInfo';
import Keyboard from './input/Keyboard';
import Commands from './input/Commands';
import StageMap, {mapStage1} from './objects/StageMap';
import Staff from "./objects/blocks/Staff";
import EnemySpawner from "./EnemySpawner";
import PlayerSpawner, {PlayerEvents} from "./PlayerSpawner";
import tiles from "./tiles";
import GameOver from "./objects/common/GameOver";

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

        this.countPlayers = 0;

        this.player1Spawner = new PlayerSpawner(this._scene, this.keyboard1, tiles.tank.yellow, 0, 3);
        scene.attach(this.player1Spawner);
        this.player1Spawner.spawnPlayer(scene);
        this.countPlayers++;
        scene.eventManager.subscribe(this.player1Spawner, PlayerEvents.dead, () => this.handlePlayerDead());

        this.player2Spawner = new PlayerSpawner(this._scene, this.keyboard2, tiles.tank.green, 1, 3);
        scene.attach(this.player2Spawner);
        this.player2Spawner.spawnPlayer(scene);
        this.countPlayers++;
        scene.eventManager.subscribe(this.player2Spawner, PlayerEvents.dead, () => this.handlePlayerDead());

        this.enemySpawner = new EnemySpawner(scene, 2000, 6, {
            NormalTank: 3,
            FastTank: 2,
            PowerTank: 2,
            ArmoredTank: 1.5,
        });

        scene.attach(this.enemySpawner);

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

    gameOver() {
        if (this.isGameOver) {
            return;
        }
        this.keyboard1.disable();
        this.keyboard2.disable();
        this._scene.attach(new GameOver());
        this.isGameOver = true;
    }

    handlePlayerDead() {
        this.countPlayers--;
        if (this.countPlayers === 0) {
            this.gameOver();
        }
    }
}