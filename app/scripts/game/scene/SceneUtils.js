import tiles from "../tiles";
export default class SceneUtils {
    /**
     * @param {Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * @param {CollisionEvent} event
     */
    handleBarrier(event) {
        event.sourceObject.updatePosition(event.time);

        if (event.allowedX !== undefined) {
            event.sourceObject.x = event.allowedX;
        }

        if (event.allowedY !== undefined) {
            event.sourceObject.y = event.allowedY;
        }
    }

    /**
     * @param {StaticObject|DynamicObject} object
     * @param animation
     */
    handleDestroy(object, animation) {
        if (this.scene.detach(object)) {
            if (animation !== undefined) {
                animation.x = object.getBaseX() - 8;
                animation.y = object.getBaseY() - 8;
                this.scene.attach(animation);
            }
        }
    }

    /**
     * @param context
     * @param num
     * @param x
     * @param y
     */
    static renderTextNumber(context, num, x, y) {
        if (num === 0) {
            tiles.gameplay.num[0].renderSceneFragment(context, x, y);
            return;
        }
        for(let scale = 1e6, i = 0; scale >= 1; scale /= 10) {
            if (scale > num) {
                continue;
            }

            const digits = Math.floor(num / scale);
            const digit = digits % 10;

            tiles.gameplay.num[digit].renderSceneFragment(context, x + i * 8, y);
            i++;
        }
    }
}