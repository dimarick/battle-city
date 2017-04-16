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
     * @param {int} time
     * @param {Array|undefined} classes
     */
    check(time, classes) {
        this.stat.fullScan++;
        const that = this;
        this.dynamicObjects.forEach((object) => {
            that.checkObject(object, time, classes);
        });
    }

    /**
     * @param object
     * @param {int} time
     * @param {Array} classes
     */
    checkObject(object, time, classes) {
        // Неподвиждые объекты не могут создать коллизию
        if (object.xSpeed === 0 && object.ySpeed === 0) {
            return;
        }

        this.stat.objectScan++;
        let collisions = this.getObjectCollisions(object, time, classes);
        this._dispatchCollisions(object, collisions);
    }

    /**
     * @param object
     * @param time
     * @param {Array} classes
     * @returns {Array}
     */
    getObjectCollisions(object, time, classes) {
        let collisions = [];
        const virtualObjectFront = this._createVirtualObjectFront(object);
        collisions = collisions.concat(this._checkScene(virtualObjectFront, time, classes));
        collisions = collisions.concat(this._checkStatic(virtualObjectFront, time, classes));
        collisions = collisions.concat(this._checkDynamic(virtualObjectFront, time, classes));

        return collisions;
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
            allowedX = this.scene.width - object.real.width;
        }

        if (allowedY === undefined && (object.y + object.ySpeed * interval + object.height) > this.scene.height) {
            allowedY = this.scene.height - object.real.height;
        }

        if (allowedX !== undefined || allowedY !== undefined) {
            return [[this.scene, time, allowedX, allowedY]];
        }

        return [];
    }

    /**
     * @param object
     * @param time
     * @param {Array} classes
     * @private
     */
    _checkStatic(object, time, classes) {
        let collisions = [];
        const centerX = object.x + object.width / 2;
        const centerY = object.y + object.height / 2;
        this.staticObjects.forEach((wall) => {
            if (!this._instanceOf(wall, classes)) {
                return
            }

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
     * @param {Array} classes
     * @private
     */
    _checkDynamic(object, time, classes) {
        const that = this;
        let collisions = [];

        const centerX = object.x + object.width / 2;
        const centerY = object.y + object.height / 2;

        this.dynamicObjects.forEach((wall) => {
            if (!this._instanceOf(wall, classes)) {
                return
            }

            if (wall === object.real) {
                return;
            }

            if (Math.abs(wall.x - centerX) > 72 || Math.abs(wall.y - centerY) > 72) {
                return;
            }

            if (object.real.supportsDynamicCollision && !object.real.supportsDynamicCollision(wall)) {
                return;
            }

            if (wall.supportsDynamicCollision && !wall.supportsDynamicCollision(object.real)) {
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
        const wallX = wall.x;
        const wallY = wall.y;
        const objectNextX = object.x + object.xSpeed * interval;
        const objectNextY = object.y + object.ySpeed * interval;

        if (
            (objectNextX > wallX) &&
            (objectNextX < wallX + wall.width) &&
            (object.y + object.height > wall.y) &&
            (object.y < wallY + wall.height)
        ) {
            if (object.xSpeed > 0) {
                allowedX = wallX - object.real.width;
            } else if (object.xSpeed < 0) {
                allowedX = wallX + wall.width;
            }
        }

        if (
            (objectNextY > wallY) &&
            (objectNextY < wallY + wall.height) &&
            (object.x + object.width > wallX) &&
            (object.x < wallX + wall.width)
        ) {
            if (object.ySpeed > 0) {
                allowedY = wallY - object.real.height;
            } else if (object.ySpeed < 0) {
                allowedY = wallY + wall.height;
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
        const wallX = wall.x + wall.xSpeed * interval;
        const wallY = wall.y + wall.ySpeed * interval;
        const objectNextX = object.x + object.xSpeed * interval;
        const objectNextY = object.y + object.ySpeed * interval;

        if (
            (objectNextX > wallX) &&
            (objectNextX < wallX + wall.width) &&
            (object.y + object.height > wallY) &&
            (object.y < wallY + wall.height)
        ) {
            if (object.xSpeed > 0) {
                allowedX = wallX - object.real.width;
            } else if (object.xSpeed < 0) {
                allowedX = wallX + wall.width;
            }
        }

        if (
            (objectNextY > wallY) &&
            (objectNextY < wallY + wall.height) &&
            (object.x + object.width > wallX) &&
            (object.x < wallX + wall.width)
        ) {
            if (object.ySpeed > 0) {
                allowedY = wallY - object.real.height;
            } else if (object.ySpeed < 0) {
                allowedY = wallY + wall.height;
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

    /**
     * Replace real object with single line at front of speed vector
     * @param object
     * @returns {{x: *, y: *, width: number, height: number, object: *}}
     * @private
     */
    _createVirtualObjectFront(object) {
        const front = {
            x: object.xSpeed > 0 ? object.x + object.width : object.x,
            y: object.ySpeed > 0 ? object.y + object.height : object.y,
            width: object.xSpeed !== 0 ? 0 : object.width,
            height: object.ySpeed !== 0 ? 0 : object.height,
            updateTime: object.updateTime,
            xSpeed: object.xSpeed,
            ySpeed: object.ySpeed,
            real: object
        };

        //Представляем 32 пиксельные объекты чуть меньшей ширины,
        //чтобы игнорировать ряд коллизий связанных с поворотом после лобового столкновения

        if (front.width >= 16) {
            front.width -= 8;
            front.x += 4;
        }

        if (front.height >= 16) {
            front.height -= 8;
            front.y += 4;
        }

        return front;
    }

    /**
     * @param object
     * @param {Array} classes
     * @private
     */
    _instanceOf(object, classes) {
        if (classes === undefined) {
            return true;
        }

        for (let className of classes) {
            if (object instanceof className) {
                return true;
            }
        }

        return false;
    }
}