import {SceneEvents} from "./Scene";
import {TankDirection} from "./objects/Tank";
import tiles from "./tiles";
import PlayerTankBirth from "./objects/PlayerTankBirth";
import PlayerTank from "./objects/PlayerTank";
import SceneUtils from "./scene/SceneUtils";

export class PlayerEvents {}
PlayerEvents.dead = 'player.dead';

export default class PlayerSpawner {
    /**
     * @param {Scene} scene
     * @param {Keyboard} keyboard
     * @param {TankTypeTileRegistry} tankTile
     * @param {int} playerNumber
     * @param {int} lifes
     */
    constructor(scene, keyboard, tankTile, playerNumber, lifes) {
        this.scene = scene;
        this.keyboard = keyboard;
        this.tankTile = tankTile;
        this.playerNumber = playerNumber;
        this.lifes = lifes;
        this.score = 0;

        this.spawnPoints = [
            {x: 4 * 16, y: 12 * 16},
            {x: 8 * 16, y: 12 * 16}
        ];

        this.lifesTile = [
            tiles.gameplay.player1Life,
            tiles.gameplay.player2Life
        ];

        this.lifesTilePos = [
            {x: 231, y: 136},
            {x: 231, y: 160}
        ];

        this.scorePos = [
            {x: 10, y: 2},
            {x: 170, y: 2}
        ];
    }

    /**
     * @param {Scene} scene
     */
    spawnPlayer(scene) {
        const score = this.player !== undefined && this.player.score ? this.player.score : 0;
        this.player = new PlayerTank(this.tankTile, this.spawnPoints[this.playerNumber].x, this.spawnPoints[this.playerNumber].y, TankDirection.up);
        this.player.score = score;
        this.keyboard.attach(this.player);
        scene.attach(new PlayerTankBirth(this.player, this.player.x, this.player.y));
        scene.eventManager.subscribe(this.player, SceneEvents.detach, () => {
            if (this.lifes <= 0) {
                scene.eventManager.dispatch(this, PlayerEvents.dead);
                return;
            }

            this.lifes--;

            scene.scheduler.timeout((time, callback) => {
                this.spawnPlayer(scene);
                scene.scheduler.clearTimeout(callback);
            }, 3000);
        });
    }

    renderLifes(context) {
        this.lifesTile[this.playerNumber].renderSceneFragment(context, this.lifesTilePos[this.playerNumber].x, this.lifesTilePos[this.playerNumber].y);
        SceneUtils.renderTextNumber(context, this.lifes, this.lifesTilePos[this.playerNumber].x + 8, this.lifesTilePos[this.playerNumber].y + 8);
    }

    renderScore(context) {
        SceneUtils.renderTextNumber(context, this.player.score, this.scorePos[this.playerNumber].x, this.scorePos[this.playerNumber].y)
    }

    render(context) {
        this.renderLifes(context);
        this.renderScore(context);
    }
}
