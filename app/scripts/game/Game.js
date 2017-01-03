import Scene from './Scene';
import DebugInfo from './objects/DebugInfo';
import StaticObject from './objects/StaticObject';
import Explosion from './objects/Explosion';
import TankBirth from './objects/TankBirth';
import Tank, {TankDirection} from './objects/Tank';
import PlayerTankBirth from './objects/PlayerTankBirth';
import StageMap, {mapStage1} from './objects/StageMap';
import tiles from './tiles';

export default class Game
{
    /**
     * @param {HTMLCanvasElement} context
     */
    constructor(context) {
        this._context = context;
    }

    start() {
        const scene = this._scene = new Scene(this._context, 'black');

        const o7 = new StaticObject([
            tiles.staff.normal
        ], 0, 6*2, 12*2);

        scene.attach(o7);

        const map = new StageMap(mapStage1);
        map.attach(scene);

        setTimeout(() => {
            scene.attach(new Explosion(o7, new StaticObject([
                tiles.staff.broken
            ], 0, 6*2, 12*2)))
        }, 4000);

        setTimeout(() => {
            const tank1 = new Tank(tiles.tank.yellow.player, 8, 24, TankDirection.up);
            tank1.setSpeed(1, TankDirection.up);
            scene.attach(new TankBirth(new StaticObject([tiles.tank.white.power.down.odd], 0, 0, 0), 0, 0));
            scene.attach(new PlayerTankBirth(tank1, 8, 24));
            scene.attach(new PlayerTankBirth(new StaticObject([tiles.tank.green.player.up.odd], 0, 16, 24), 16, 24));
        }, 2000);
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