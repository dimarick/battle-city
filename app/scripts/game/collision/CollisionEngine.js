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
        this.stat = {
            objects: {
                stat: 0,
                dyn: 0
            },
            fullScan: 0,
            objectScan: 0,
            pairScan: 0,
            events: 0
        };
    }

    /**
     * @param object
     */
    attachStatic(object) {
        this.staticObjects.add(object);
        this.stat.objects.stat++;
    }

    /**
     * @param object
     */
    attachDynamic(object) {
        this.dynamicObjects.add(object);
        this.stat.objects.dyn++;
    }

    /**
     * @param object
     */
    detach(object) {
        if (this.staticObjects.has(object)) {
            this.staticObjects.delete(object);
            this.stat.objects.stat--;
        } else if (this.dynamicObjects.has(object)) {
            this.dynamicObjects.delete(object);
            this.stat.objects.dyn--;
        }
    }

    /**
     * @param time
     */
    check(time) {
        this.stat.fullScan++;
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
        this.stat.objectScan++;
        let collisions = [];
        collisions = collisions.concat(this._checkScene(object, time));
        collisions = collisions.concat(this._checkStatic(object, time));
        collisions = collisions.concat(this._checkDynamic(object, time));
        this._dispatchCollisions(object, collisions);
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
            return [[this.scene, time, allowedX, allowedY]];
        }

        return [];
    }

    /**
     * @param object
     * @param time
     * @private
     */
    _checkStatic(object, time) {
        let collisions = [];
        const centerX = object.x + object.width / 2;
        const centerY = object.y + object.height / 2;
        this.staticObjects.forEach((wall) => {
            if (Math.abs(wall.x - centerX) > 64 || Math.abs(wall.y - centerY) > 64) {
                return;
            }
            collisions = collisions.concat(this._checkStaticPair(object, wall, time));
        });

        return collisions;
    }

    /**
     * @param object
     * @param time
     * @private
     */
    _checkDynamic(object, time) {
        const that = this;
        let collisions = [];

        const centerX = object.x + object.width / 2;
        const centerY = object.y + object.height / 2;

        this.dynamicObjects.forEach((wall) => {
            if (wall === object) {
                return;
            }

            if (Math.abs(wall.x - centerX) > 72 || Math.abs(wall.y - centerY) > 72) {
                return;
            }

            if (object.supportsDynamicCollision && !object.supportsDynamicCollision(wall)) {
                return;
            }

            if (wall.supportsDynamicCollision && !wall.supportsDynamicCollision(object)) {
                return;
            }

            collisions = collisions.concat(that._checkDynamicPair(object, wall, time));
        });

        return collisions;
    }

    _checkStaticPair(object, wall, time) {
        this.stat.pairScan++;
        let allowedX, allowedY;
        const interval = (time - object.updateTime);

        if (
            (object.x + object.xSpeed * interval + object.width > wall.x) &&
            (object.x + object.xSpeed * interval < wall.x + wall.width) &&
            (object.y + object.height > wall.y) &&
            (object.y < wall.y + wall.height)
        ) {
            if (object.xSpeed > 0) {
                allowedX = wall.x - object.width;
            } else if (object.xSpeed < 0) {
                allowedX = wall.x + wall.width;
            }
        }

        if (
            (object.y + object.ySpeed * interval + object.height > wall.y) &&
            (object.y + object.ySpeed * interval < wall.y + wall.height) &&
            (object.x + object.width > wall.x) &&
            (object.x < wall.x + wall.width)
        ) {
            if (object.ySpeed > 0) {
                allowedY = wall.y - object.height;
            } else if (object.ySpeed < 0) {
                allowedY = wall.y + wall.height;
            }
        }

        if (allowedX !== undefined || allowedY !== undefined) {
            return [[wall, time, allowedX, allowedY]];
        }

        return [];
    }

    _checkDynamicPair(object, wall, time) {
        this.stat.pairScan++;
        let allowedX, allowedY;
        const interval = (time - object.updateTime);

        if (
            (object.x + object.xSpeed * interval + object.width > wall.x) &&
            (object.x + object.xSpeed * interval < wall.x + wall.width) &&
            (object.y + object.height > wall.y) &&
            (object.y < wall.y + wall.height)
        ) {
            if (object.xSpeed > 0) {
                allowedX = wall.x - object.width;
            } else if (object.xSpeed < 0) {
                allowedX = wall.x + wall.width;
            }
        }

        if (
            (object.y + object.ySpeed * interval + object.height > wall.y) &&
            (object.y + object.ySpeed * interval < wall.y + wall.height) &&
            (object.x + object.width > wall.x) &&
            (object.x < wall.x + wall.width)
        ) {
            if (object.ySpeed > 0) {
                allowedY = wall.y - object.height;
            } else if (object.ySpeed < 0) {
                allowedY = wall.y + wall.height;
            }
        }

        if (allowedX !== undefined || allowedY !== undefined) {
            return [[wall, time, allowedX, allowedY]];
        }

        return [];
    }

    /**
     * @param object
     * @param {Array} collisions
     * @private
     */
    _dispatchCollisions(object, collisions) {
        if (collisions.length === 0) {
            return;
        }

        this.stat.events++;

        const mergedEvent = collisions.reduce((mergedEvent, collisionEvent) => {
            const [target, time, allowedX, allowedY] = collisionEvent;

            mergedEvent.allowedX = this._mergePositionCoordinate(allowedX, mergedEvent.allowedX, object.xSpeed);
            mergedEvent.allowedY = this._mergePositionCoordinate(allowedY, mergedEvent.allowedY, object.ySpeed);

            if (mergedEvent.time !== undefined) {
                mergedEvent.time = Math.min(time, mergedEvent.time);
            } else {
                mergedEvent.time = time;
            }

            mergedEvent.targetObject.push(target);

            return mergedEvent;
        }, new CollisionEvent(object, []));

        this.scene.eventManager.dispatchMultiple([object].concat(mergedEvent.targetObject), CollisionEvent.contact, mergedEvent);
    }

    _mergePositionCoordinate(position1, position2, speed) {
        if (position1 !== undefined) {
            if (position2 !== undefined) {
                if (speed > 0) {
                    return Math.min(position1, position2);
                } else if (speed < 0) {
                    return Math.max(position1, position2);
                }
            } else {
                return position1;
            }
        }

        return position2;
    }
}