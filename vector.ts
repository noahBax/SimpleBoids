class Vector {
    x = 0;
    y = 0;

    constructor()
    constructor(obj: {x: number, y: number})
    constructor(vector: Vector)
    constructor(x: number, y: number)
    constructor(x?: number | {x: number, y: number}, y?: number) {
        if (x instanceof Object) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x ?? 0;
            this.y = y ?? 0;
        }
    }

    get asArray(): [number, number] {
        return [this.x, this.y];
    }

    get theta(): number {
        if (this.x == 0) {
            if (this.y > 0) return Math.PI/2;
            return Math.PI * 1.5;
        }
        let ret = Math.atan(this.y / this.x);
        if (this.x < 0) ret += Math.PI;
        ret = (ret + 2 * Math.PI) % (2 * Math.PI);
        return ret;
    }
    
    add(vec: {x: number, y: number}): Vector
    add(vec: {x: number, y: number}, noChange: boolean): Vector
    add(vec: {x: number, y: number}, noChange=false): Vector {
        if (!noChange) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        } else {
            return new Vector(this.x + vec.x, this.y + vec.y)
        }
    }

    subtract(vec: {x: number, y: number}): Vector
    subtract(vec: {x: number, y: number}, noChange: boolean): Vector
    subtract(vec: {x: number, y: number}, noChange=false): Vector {
        if (!noChange) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        } else {
            return new Vector(this.x - vec.x, this.y - vec.y)
        }
    }

    mult(value: number, noChange: true): Vector
    mult(value: number): null
    mult(value: number, noChange=false): Vector | null {
        if (noChange) {
            return new Vector(this.x * value, this.y * value);
        } else {
            this.x *= value;
            this.y *= value;
        }
    }

    div(value: number, noChange: true): Vector
    div(value: number): null
    div(value: number, noChange=false): Vector | null {
        if (noChange) {
            return new Vector(this.x / value, this.y / value);
        } else {
            this.x /= value;
            this.y /= value;
        }
    }

    angleDifference(vec: {x: number, y: number}): number {
        return Math.acos((vec.x * this.x + vec.y + this.y) / this.magnitude / Math.sqrt(vec.x**2 + vec.y**2) );
    }

    normalize(): Vector {
        const magnitude = Math.sqrt(this.x**2 + this.y**2);
        if (magnitude == 0) return this;
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }

    addAngle(theta: number, noChange=true): Vector {
        const thetaNew = this.theta - theta;
        this.x = Math.cos(thetaNew)// * (thetaNew > Math.PI ? -1 : 1);
        this.y = Math.sin(thetaNew)
        return this;
    }

    get magnitude(): number {
        return Math.sqrt(this.x**2 + this.y**2);
    }
}