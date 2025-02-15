"use strict";
class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        if (x instanceof Object) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x ?? 0;
            this.y = y ?? 0;
        }
    }
    get asArray() {
        return [this.x, this.y];
    }
    get theta() {
        if (this.x == 0) {
            if (this.y > 0)
                return Math.PI / 2;
            return Math.PI * 1.5;
        }
        let ret = Math.atan(this.y / this.x);
        if (this.x < 0)
            ret += Math.PI;
        ret = (ret + 2 * Math.PI) % (2 * Math.PI);
        return ret;
    }
    add(vec, noChange = false) {
        if (!noChange) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        }
        else {
            return new Vector(this.x + vec.x, this.y + vec.y);
        }
    }
    subtract(vec, noChange = false) {
        if (!noChange) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        }
        else {
            return new Vector(this.x - vec.x, this.y - vec.y);
        }
    }
    mult(value, noChange = false) {
        if (noChange) {
            return new Vector(this.x * value, this.y * value);
        }
        else {
            this.x *= value;
            this.y *= value;
        }
    }
    div(value, noChange = false) {
        if (noChange) {
            return new Vector(this.x / value, this.y / value);
        }
        else {
            this.x /= value;
            this.y /= value;
        }
    }
    angleDifference(vec) {
        return Math.acos((vec.x * this.x + vec.y + this.y) / this.magnitude / Math.sqrt(vec.x ** 2 + vec.y ** 2));
    }
    normalize() {
        const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (magnitude == 0)
            return this;
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }
    addAngle(theta, noChange = true) {
        const thetaNew = this.theta - theta;
        this.x = Math.cos(thetaNew); // * (thetaNew > Math.PI ? -1 : 1);
        this.y = Math.sin(thetaNew);
        return this;
    }
    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}
