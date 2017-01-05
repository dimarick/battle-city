import tiles from '../../tiles';
import StaticObject from '../StaticObject';

export default class Ice extends StaticObject {
    constructor(x, y) {
        super([tiles.block.ice], 0, x, y, 8, 8);
    }
}