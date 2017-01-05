export default class DynamicObject {

    setVector(xSpeed, ySpeed) {
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    getBaseX() {
        return this.x + this.width / 2;
    }

    getBaseY() {
        return this.y + this.height / 2;
    }

    updatePosition(time) {
        if (this.updateTime !== undefined) {
            const interval = time - this.updateTime;
            this.x += interval * this.xSpeed;
            this.y += interval * this.ySpeed;
        }

        this.updateTime = time;
    }
}
