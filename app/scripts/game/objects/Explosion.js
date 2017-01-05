import OnceObject from './OnceObject';
import tiles from '../tiles';

export default class Explosion {

    static explodeAnimationLarge() {
        return new OnceObject(tiles.explosion.stage, 80, -1000, -1000);
    }

    static explodeAnimationSmall() {
        return new OnceObject(tiles.explosion.stage.slice(1, 2), 80, -1000, -1000);
    }
}