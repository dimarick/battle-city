import tiles from '../../tiles';
import StaticObject from '../StaticObject';

export default class Forest extends StaticObject {
    constructor(x, y) {
        super([tiles.block.forest], 0, x, y, 8, 8);
    }
}