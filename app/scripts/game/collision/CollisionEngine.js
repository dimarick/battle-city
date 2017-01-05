export class CollisionEvent {
    constructor(sourceObject, targetObject, time, allowedX, allowedY) {
        this.sourceObject = sourceObject;
        this.targetObject = targetObject;
        this.time = time;
        this.allowedX = allowedX;
        this.allowedY = allowedY;
    }
}

CollisionEvent.contact = 'collision.contact';

export default class CollisionEngine {
    /**
     * @param {Scene} scene
     */
    constructor(scene) {
        this.staticObjects = new Set();
        this.dynamicObjects = new Set();
        this.scene = scene;
        const that = this;
    }



    /**
     * @param object
     */
    attachStatic(object) {
        this.staticObjects.add(object);
    }

    /**
     * @param object
     */
    attachDynamic(object) {
        this.dynamicObjects.add(object);
    }

    /**
     * @param object
     */
    detach(object) {
        this.staticObjects.delete(object);
        this.dynamicObjects.delete(object);
    }

    /**
     * @param time
     */
    check(time) {
        const that = this;
        this.dynamicObjects.forEach((object) => {
            that.checkObject(object, time);
        });
    }

    /**
     * @param object
     * @param time
     */
    checkObject(object, time) {
        this._checkScene(object, time);
        this._checkStatic(object, time)
    }

    /**
     * @param object
     * @param time
     * @private
     */
    _checkScene(object, time) {
        let allowedX, allowedY;

        const interval = (time - object.updateTime);
        if (object.x + object.xSpeed * interval < 0) {
            allowedX = 0;
        }

        if (object.y + object.ySpeed * interval < 0) {
            allowedY = 0;
        }

        if (allowedX === undefined && (object.x + object.xSpeed * interval + object.width) > this.scene.width) {
            allowedX = this.scene.width - object.width;
        }

        if (allowedY === undefined && (object.y + object.ySpeed * interval + object.height) > this.scene.height) {
            allowedY = this.scene.height - object.height;
        }

        if (allowedX !== undefined || allowedY !== undefined) {
            this.scene.eventManager.dispatch(object, CollisionEvent.contact, new CollisionEvent(object, this.scene, time, allowedX, allowedY));
        }
    }

    /**
     * @param object
     * @param time
     * @private
     */
    _checkStatic(object, time) {
        const that = this;
        that.staticObjects.forEach((wall) => {
            let allowedX, allowedY;
            const interval = (time - object.updateTime);

            if (
                (object.x + object.xSpeed * interval + object.width > wall.x * 8) &&
                (object.x + object.xSpeed * interval < wall.x * 8 + wall.width) &&
                (object.y + object.height > wall.y * 8) &&
                (object.y < wall.y * 8 + wall.height)
            ) {
                if (object.xSpeed > 0) {
                    allowedX = wall.x * 8 - object.width;
                } else if (object.xSpeed < 0) {
                    allowedX = wall.x * 8 + wall.width;
                }
            }

            if (
                (object.y + object.ySpeed * interval + object.height > wall.y * 8) &&
                (object.y + object.ySpeed * interval < wall.y * 8 + wall.height) &&
                (object.x + object.width > wall.x * 8) &&
                (object.x < wall.x * 8 + wall.width)
            ) {
                if (object.ySpeed > 0) {
                    allowedY = wall.y * 8 - object.height;
                } else if (object.ySpeed < 0) {
                    allowedY = wall.y * 8 + wall.height;
                }
            }

            if (allowedX !== undefined || allowedY !== undefined) {
                that.scene.eventManager.dispatch(object, CollisionEvent.contact, new CollisionEvent(object, wall, time, allowedX, allowedY));
            }
        });
    }
}