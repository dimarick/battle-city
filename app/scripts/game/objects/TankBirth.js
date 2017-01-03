import OnceObject from './OnceObject';
import StaticObject from './StaticObject';
import tiles from '../tiles';
import eventManager from '../event/eventManager';

export default class TankBirth extends OnceObject {
    constructor(tank, x, y) {
        const birth = tiles.birth;

        super([
            birth.state[4-1],
            birth.state[3-1],
            birth.state[3-1],
            birth.state[1-1],
            birth.state[2-1],
            birth.state[1-1],
            birth.state[1-1],
            birth.state[1-1],
            birth.state[2-1],
            birth.state[2-1],
            birth.state[3-1],
            birth.state[3-1],
            birth.state[4-1],
            birth.state[4-1],
            birth.state[4-1],
            birth.state[3-1],
            birth.state[3-1],
            birth.state[2-1],
            birth.state[2-1],
            birth.state[1-1],
            birth.state[1-1],
            birth.state[1-1],
            birth.state[2-1],
            birth.state[2-1],
            birth.state[3-1],
            birth.state[3-1],
        ], 40, x, y);

        this.tank = tank;
    }

    /**
     * @param {Scene} scene
     */
    onDetach(scene) {
        scene.attach(this.tank);
    }
}