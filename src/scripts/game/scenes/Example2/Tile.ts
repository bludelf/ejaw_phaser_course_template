import Example2 from "../Example2";

export default class Tile extends Phaser.GameObjects.Image {
    public grid_position = -1;
    public grid_x: number;
    public grid_y: number;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, "tiles", 0);
        this.setScale(0.5);
        this.clear();
        this.setDepth(1);
        this.scene.add.existing(this);
    }

    public setGridPosition(
        position: number,
        grid: Phaser.Math.Vector3[][],
        cols: number,
        rows: number
    ) {
        this.grid_position = position;
        this.x = grid[Math.floor(position / cols)][position % rows].x;
        this.y = grid[Math.floor(position / cols)][position % rows].y;
        this.grid_x = Math.floor(position / cols);
        this.grid_y = position % rows;
    }

    public setsGridPosition(
        position: number,
        grid: Phaser.Math.Vector3[][],
        cols: number,
        rows: number
    ) {
        this.grid_position = position;
        this.grid_x = Math.floor(position / cols);
        this.grid_y = position % rows;
    }

    public getGridPosition() {
        return { x: this.grid_x, y: this.grid_y };
    }

    public clearGridPosition() {
        this.grid_position = -1;
    }

    public updatePosition(
        grid: Phaser.Math.Vector3[][],
        cols: number,
        rows: number
    ) {
        const position = this.grid_position;
        const x = grid[Math.floor(position / cols)][position % rows].x;
        const y = grid[Math.floor(position / cols)][position % rows].y;

        const myscene = this.scene;
        var tween = myscene.tweens.add({
            targets: this,
            x: x,
            y: y,
            ease: "Linear",
            duration: 500,
            onComplete: function () {
                tween.remove();
                myscene.input.keyboard.enabled = true;
            },
        });
    }

    public clear() {
        this.setVisible(false);
        this.setActive(false);
        this.clearGridPosition();
    }

    public activate() {
        this.setVisible(true);
        this.setActive(true);
    }
}
