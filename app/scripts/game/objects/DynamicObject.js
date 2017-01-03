import StaticObject from './StaticObject'

export default class DynamicObject {

    setVector(xSpeed, ySpeed) {
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    updatePosition(time) {
        if (this.prevPositionTime !== undefined) {
            const interval = time - this.prevPositionTime;
            this.x += interval * this.xSpeed;
            this.y += interval * this.ySpeed;
        }
        this.prevPositionTime = time;
    }
}
