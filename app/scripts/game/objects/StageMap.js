import tiles from '../tiles'
import Brick from './blocks/Brick';
import Concrete from './blocks/Concrete';
import Forest from './blocks/Forest';
import Ice from './blocks/Ice';
import Water from './blocks/Water';

export const mapStage1 =
    '                                                    ' +
    '                                                    ' +
    '    bkbk    bkbk    bkbk    bkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbk    bkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbk    bkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbk    bkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbkctctbkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbkctctbkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbk    bkbk    bkbk    bkbk    ' +
    '    bkbk    bkbkicicicicicicicicicicbkbk    bkbk    ' +
    '    bkbk    bkbkicicicicicicicicicicbkbk    bkbk    ' +
    '                    bkbk    bkbk                    ' +
    '                    bkbk    bkbk                    ' +
    'bkbk    bkbkbkbk                    bkbkbkbk    bkbk' +
    'ctct    bkbkbkbk                    bkbkbkbk    ctct' +
    '    wtwtwtwtwtwtwtwtbkbk    bkbkfrfrfrfrfrfrfrfr    ' +
    '    wtwtwtwtwtwtwtwtbkbkbkbkbkbkfrfrfrfrfrfrfrfr    ' +
    '    bkbk    bkbk    bkbkbkbkbkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbk    bkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbk    bkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk    bkbk    bkbk    bkbk    bkbk    ' +
    '    bkbk    bkbk                    bkbk    bkbk    ' +
    '    bkbk    bkbk                    bkbk    bkbk    ' +
    '    bkbk    bkbk      bkbkbkbk      bkbk    bkbk    ' +
    '                      bk    bk                      ' +
    '                      bk    bk                      '
;

export default class StageMap {
    constructor(map) {
        this.objects = this._parseMap(map);
    }

    /**
     * @param {Scene} scene
     */
    attach(scene) {
        this.objects.forEach((object) => {
            scene.attach(object);
        });
    }

    /**
     * @param {string} map
     * @returns {Array}
     */
    _parseMap(map) {
        const objects = [];

        for(let i = 0; i*2 < map.length; i++) {
            const blockType = map.substr(i*2, 2);
            const x = i % 26;
            const y = Math.floor(i / 26);

            switch (blockType) {
                case '  ':
                    break;
                case 'bk':
                    objects.push(new Brick(x, y));
                    break;
                case 'ct':
                    objects.push(new Concrete(x, y));
                    break;
                case 'fr':
                    objects.push(new Forest(x, y));
                    break;
                case 'wt':
                    objects.push(new Water(x, y));
                    break;
                case 'ic':
                    objects.push(new Ice(x, y));
                    break;
            }
        }

        return objects;
    }
}