export default class Vector2 extends Phaser.Math.Vector2 {
    constructor(x, y) {
        super(x, y);
    }

    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);

        return this;
    }

    trend() {
        let { x, y } = this;
        this.abs();
        this.x < this.y && ([x, y] = [0, y]);
        this.x > this.y && ([x, y] = [x, 0]);
        this.x = x;
        this.y = y;
        return this;
    }

    roundCoords() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }
}
