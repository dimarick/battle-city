import sprite from './sprite';

class Tile {
    /**
     * @param {Tile} parent
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     * @param {int} baseX
     * @param {int} baseY
     */
    constructor(parent, x, y, width, height, baseX, baseY) {
        this.parent = parent;
        this.x = x || 0;
        this.y = y || 0;
        this.baseX = baseX || 0;
        this.baseY = baseY || 0;
        this.width = width || this.parent.getWidth() - x;
        this.height = height || this.parent.getHeight() - y;
        this.scale = 3;
    }

    getImage() {
        return this.parent.getImage();
    }

    getX() {
        return this.parent.getX() + this.x;
    }

    getY() {
        return this.parent.getY() + this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {Tile}
     */
    getTile(x, y, width, height) {
        return new Tile(this, x, y, width, height)
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {int} x
     * @param {int} y
     */
    renderFragment(context, x, y) {
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        context.drawImage(
            this.getImage(),
            this.getX(),
            this.getY(),
            this.getWidth(),
            this.getHeight(),
            (x - this.baseX) * this.scale,
            (y - this.baseY) * this.scale,
            this.getWidth() * this.scale,
            this.getHeight() * this.scale
        );
    }
}

export class LargeTile extends Tile {
    constructor(parent, x, y, width, height, baseX, baseY) {
        super(parent, x * 16, y * 16, width * 16, height * 16, baseX * 16, baseY * 16);
    }
}

export class SmallTile extends Tile {
    constructor(parent, x, y, width, height, baseX, baseY) {
        super(parent, x * 8, y * 8, width * 8, height * 8, baseX * 8, baseY * 8);
    }
}

export class NullTile extends Tile {
    renderFragment () {}
}

export class CombinedTile {
    /**
     * @param {Tile[][]} tiles
     */
    constructor(tiles) {
        this.tiles = tiles;
    }

    renderFragment(context, x, y) {
        let offsetX = 0;
        let offsetY = 0;

        this.tiles.forEach((tilesRow) => {
            if (tilesRow.length > 0) {
                tilesRow.forEach((tile) => {
                    tile.renderFragment(context, x + offsetX, y + offsetY);
                    offsetX += tile.getWidth();
                });

                offsetY += tilesRow[0].getHeight();
                offsetX = 0;
            }
        });
    }
}

export class OverlappedTile {
    /**
     * @param {Tile[][]} tiles
     */
    constructor(tiles) {
        this.tiles = tiles;
    }

    renderFragment(context, x, y) {
        this.tiles.forEach((tile) => {
            tile.renderFragment(context, x, y);
        });
    }
}

class TankStateTileRegistry extends LargeTile {
    constructor(parent, x, y) {
        super(parent, x * 2, y, 2, 1);

        this.odd = new LargeTile(this, 0, 0, 1, 1);
        this.even = new LargeTile(this, 1, 0, 1, 1);
    }
}

class TankDirectionTileRegistry extends LargeTile {
    constructor(parent, y) {
        super(parent, 0, y, 8, 1);

        this.up = new TankStateTileRegistry(this, 0, 0, 1, 1);
        this.left = new TankStateTileRegistry(this, 1, 0, 1, 1);
        this.down = new TankStateTileRegistry(this, 2, 0, 1, 1);
        this.right = new TankStateTileRegistry(this, 3, 0, 1, 1);
    }
}

class TankTypeTileRegistry extends LargeTile {
    constructor(parent, x, y) {
        super(parent, x * 8, y * 8, 8, 8);

        this.player = new TankDirectionTileRegistry(this, 0);
        this.playerL1 = new TankDirectionTileRegistry(this, 1);
        this.playerL2 = new TankDirectionTileRegistry(this, 2);
        this.playerL3 = new TankDirectionTileRegistry(this, 3);
        this.normal = new TankDirectionTileRegistry(this, 4);
        this.fast = new TankDirectionTileRegistry(this, 5);
        this.power = new TankDirectionTileRegistry(this, 6);
        this.armored = new TankDirectionTileRegistry(this, 7);
    }
}

class TankColorTileRegistry extends LargeTile {
    constructor(parent) {
        super(parent, 0, 0, 16, 16);

        this.yellow = new TankTypeTileRegistry(this, 0, 0);
        this.green = new TankTypeTileRegistry(this, 0, 1);
        this.white = new TankTypeTileRegistry(this, 1, 0);
        this.red = new TankTypeTileRegistry(this, 1, 1);
    }
}

class BonusTileRegistry extends LargeTile {
    constructor(parent) {
        super(parent, 16, 7, 8, 1);

        this.helmet = new LargeTile(this, 0, 0, 1, 1);
        this.watch = new LargeTile(this, 1, 0, 1, 1);
        this.spade = new LargeTile(this, 2, 0, 1, 1);
        this.star = new LargeTile(this, 3, 0, 1, 1);
        this.bomb = new LargeTile(this, 4, 0, 1, 1);
        this.tank = new LargeTile(this, 5, 0, 1, 1);
        this.gun = new LargeTile(this, 6, 0, 1, 1);
    }
}

class BrickStateRegistry extends SmallTile {
    constructor(parent, x, y) {
        super(parent, x, y, 1, 1);
        this.right = new CombinedTile([[new NullTile(this, 0, 0, 4, 8), this.getTile(4, 0, 4, 8)]]);
        this.left = new CombinedTile([[this.getTile(0, 0, 4, 8), new NullTile(this, 0, 0, 4, 8)]]);
    }
}

class WaterStateRegistry extends SmallTile {
    constructor(parent, x, y) {
        super(parent, x, y, 3, 1);
        this.states = [
            new SmallTile(this, 0, 0, 1, 1),
            new SmallTile(this, 1, 0, 1, 1),
            new SmallTile(this, 2, 0, 1, 1)
        ]
    }
}

class BlockTileRegistry extends SmallTile {
    constructor(parent) {
        super(parent, 32, 8, 5, 3);

        this.brick = new SmallTile(this, 0, 0, 1, 1);
        this.water = new WaterStateRegistry(this, 0, 2);
        this.concrete = new SmallTile(this, 0, 1, 1, 1);
        this.forest = new SmallTile(this, 1, 1, 1, 1);
        this.ice = new SmallTile(this, 2, 1, 1, 1);
    }
}

class StaffTileRegistry extends LargeTile {
    constructor(parent) {
        super(parent, 19, 2, 2, 1);

        this.normal = new LargeTile(this, 0, 0, 1, 1);
        this.broken = new LargeTile(this, 1, 0, 1, 1);
    }
}

class ExplosionTileRegistry extends LargeTile {
    constructor(parent) {
        super(parent, 16, 8, 7, 2);

        this.stage = [
            new LargeTile(this, 0, 0, 1, 1),
            new LargeTile(this, 1, 0, 1, 1),
            new LargeTile(this, 2, 0, 1, 1),
            new LargeTile(this, 3, 0, 2, 2, 0.5, 0.5),
            new LargeTile(this, 5, 0, 2, 2, 0.5, 0.5)
        ];
    }
}

class BirthTileRegistry extends LargeTile {
    constructor(parent) {
        super(parent, 16, 6, 4, 1);

        this.state = [
            new LargeTile(this, 0, 0, 1, 1),
            new LargeTile(this, 1, 0, 1, 1),
            new LargeTile(this, 2, 0, 1, 1),
            new LargeTile(this, 3, 0, 1, 1)
        ];
    }
}

class BulletTileRegistry extends Tile {
    constructor(parent) {
        super(parent, 322, 102, 27, 4);

        this.up = new Tile(this, 0, 0, 4, 4);
        this.left = new Tile(this, 8, 0, 4, 4);
        this.down = new Tile(this, 16, 0, 4, 4);
        this.right = new Tile(this, 24, 0, 4, 4);
    }
}

class TileRegistry extends Tile {
    constructor() {
        super(undefined, 0, 0, 400, 256);
        this.image = new Image();
        this.image .src = sprite;

        this.tank = new TankColorTileRegistry(this);
        this.bonus = new BonusTileRegistry(this);
        this.block = new BlockTileRegistry(this);
        this.explosion = new ExplosionTileRegistry(this);
        this.staff = new StaffTileRegistry(this);
        this.birth = new BirthTileRegistry(this);
        this.bullet = new BulletTileRegistry(this);
        this.null = new NullTile(this);
    }

    getImage() {
        return this.image;
    }

    getX() {
        return 0;
    }

    getY() {
        return 0;
    }
}

export default new TileRegistry();