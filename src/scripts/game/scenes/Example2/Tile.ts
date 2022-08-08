import Example2 from "../Example2";

export default class Tile extends Phaser.GameObjects.Image {
    public grid_position = -1;
    public grid_x: number;
    public grid_y: number;

    static readonly frames = [
        "2.png",
        "4.png",
        "8.png",
        "16.png",
        "32.png",
        "64.png",
        "128.png",
        "256.png",
        "512.png",
        "1024.png",
    ];

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, "tiles", 0);
        this.setScale(0.95);
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

    public updateGridPosition(grid_x: number, grid_y: number, cols: number) {
        this.grid_x = grid_x;
        this.grid_y = grid_y;
        this.grid_position = grid_x * cols + grid_y;
    }

    public getGridPosition() {
        return { x: this.grid_x, y: this.grid_y };
    }

    public clearGridPosition() {
        this.grid_position = -1;
        this.setFrameIndex(0);
    }

    public updatePosition(grid: Phaser.Math.Vector3[][], countMoves: number) {
        return new Promise((resolve) => {
            if (this.grid_position === -1) resolve(undefined);

            const x = grid[this.grid_x][this.grid_y].x;
            const y = grid[this.grid_x][this.grid_y].y;

            this.scene.tweens.add({
                targets: this,
                x: x,
                y: y,
                duration: countMoves * 50,
                onComplete: resolve,
            });
        });
    }

    public getFrameIndex() {
        return Tile.frames.indexOf(String(this.frame.name));
    }

    public upgrade() {
        const frame = this.getFrameIndex();

        this.setFrameIndex(frame + 1);
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

    private setFrameIndex(index: number) {
        if (index >= Tile.frames.length) return false;
        //this.setFrame(Tile.frames[index]);
        this.setTexture("ui", Tile.frames[index]);
        return true;
    }
}
