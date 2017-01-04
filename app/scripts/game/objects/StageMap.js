import tiles from '../tiles'
import StaticObject from './StaticObject'

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
    '    bkbk    bkbk                    bkbk    bkbk    ' +
    '    bkbk    bkbk                    bkbk    bkbk    ' +
    '                    bkbk    bkbk                    ' +
    '                    bkbk    bkbk                    ' +
    'bkbk    bkbkbkbk                    bkbkbkbk    bkbk' +
    'ctct    bkbkbkbk                    bkbkbkbk    ctct' +
    '                    bkbk    bkbk                    ' +
    '                    bkbkbkbkbkbk                    ' +
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
                    objects.push(new StaticObject([tiles.block.brick], 0, x, y, 8, 8));
                    break;
                case 'ct':
                    objects.push(new StaticObject([tiles.block.concrete], 0, x, y, 8, 8));
                    break;
                case 'fr':
                    objects.push(new StaticObject([tiles.block.forest], 0, x, y));
                    break;
                case 'wt':
                    objects.push(new StaticObject(tiles.block.water.state, 320, x, y, 8, 8));
                    break;
                case 'ic':
                    objects.push(new StaticObject([tiles.block.ice], 0, x, y));
                    break;
            }
        }

        return objects;
    }
}