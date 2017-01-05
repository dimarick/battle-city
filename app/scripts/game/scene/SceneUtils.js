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
            this.scene.collisionEngine.detach(object);
            if (animation !== undefined) {
                animation.x = object.getBaseX() / 8 - 1;
                animation.y = object.getBaseY() / 8 - 1;
                this.scene.attach(animation);
            }
        }
    }
}