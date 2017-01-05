import Scene from './Scene';
import DebugInfo from './objects/DebugInfo';
import StaticObject from './objects/StaticObject';
import Explosion from './objects/Explosion';
import TankBirth from './objects/TankBirth';
import {TankDirection} from './objects/Tank';
import PlayerTank from './objects/PlayerTank';
import Keyboard from './input/Keyboard';
import Commands from './input/Commands';
import PlayerTankBirth from './objects/PlayerTankBirth';
import StageMap, {mapStage1} from './objects/StageMap';
import tiles from './tiles';
import Staff from "./objects/blocks/Staff";

export default class Game
{
    /**
     * @param {CanvasRenderingContext2D} context
     */
    constructor(context) {
        this._context = context;
    }

    start() {
        const scene = this._scene = new Scene(this._context, 'black');

        scene.attach(new Staff(6*2, 12*2));

        const map = new StageMap(mapStage1);
        map.attach(scene);

        const tank1 = new PlayerTank(tiles.tank.yellow, 8, 24, TankDirection.up);
        const tank2 = new PlayerTank(tiles.tank.green, 16, 24, TankDirection.up);

        const keyboard = new Keyboard({
            38: Commands.up,
            40: Commands.down,
            37: Commands.left,
            39: Commands.right,
            96: Commands.fire
        }, tank1, scene.eventManager);

        keyboard.attach();

        const keyboardP2 = new Keyboard({
            87: Commands.up,
            83: Commands.down,
            65: Commands.left,
            68: Commands.right,
            32: Commands.fire
        }, tank2, scene.eventManager);

        keyboardP2.attach();

        scene.attach(new TankBirth(new StaticObject([tiles.tank.white.power.down.odd], 0, 0, 0), 0, 0));
        scene.attach(new PlayerTankBirth(tank1, 8, 24));
        scene.attach(new PlayerTankBirth(tank2, 16, 24));
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