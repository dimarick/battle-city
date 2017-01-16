import tiles from '../../tiles';
import {CollisionEvent} from '../../collision/CollisionEngine';
import Explosion from '../Explosion';
import Tank from '../Tank';
import Bullet from '../Bullet';
import PowerBullet from "../PowerBullet";

export default class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.tile = {
            x: 0,
            y: 0,
            width: 8,
            height: 8,
        };
    }

    render(context) {
        tiles.block.brick
            .getTile(this.tile.x, this.tile.y, this.tile.width, this.tile.height)
            .renderFragment(context, this.x + this.tile.x, this.y + this.tile.y);
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        this.scene = scene;
        scene.collisionEngine.attachStatic(this);
        scene.eventManager.subscribe(this, CollisionEvent.contact, (object, event) => this.handleCollision(event));
    }

    /**
     * @param {CollisionEvent} event
     */
    handleCollision(event) {
        if (event.sourceObject instanceof Bullet) {
            this.damage(event.sourceObject);
            this.scene.utils.handleDestroy(event.sourceObject, Explosion.explodeAnimationSmall());
        } else if (event.sourceObject instanceof Tank) {
            this.scene.utils.handleBarrier(event);
        }
    }

    /**
     * @param {Bullet} bullet
     */
    damage(bullet) {
        if (bullet instanceof PowerBullet) {
            this.destroy();
        }
        if (bullet.ySpeed > 0) {
            this.damageUp();
        } else if (bullet.ySpeed < 0) {
            this.damageDown();
        } else if (bullet.xSpeed > 0) {
            this.damageLeft();
        } else if (bullet.xSpeed < 0) {
            this.damageRight();
        }
    }

    damageUp() {
        this.y += 3;
        this.height -= 3;

        this.tile.y +=1;
        this.tile.height -=4;

        this.autoDestroy();
    }

    damageDown() {
        this.height -= 3;

        this.tile.height -= 4;

        this.autoDestroy();
    }

    damageLeft() {
        this.x += 3;
        this.width -= 3;

        this.tile.x +=1;
        this.tile.width -=4;

        this.autoDestroy();
    }

    damageRight() {
        this.width -= 3;

        this.tile.width -=4;

        this.autoDestroy();
    }

    autoDestroy() {
        if (this.height <= 3 || this.width <= 3) {
            this.destroy();
        }
    }

    destroy() {
        this.scene.detach(this);
        this.scene.collisionEngine.detach(this);
    }
}