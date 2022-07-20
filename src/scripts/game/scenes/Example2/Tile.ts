import Example2 from "../Example2";

export default class Tile extends Phaser.GameObjects.Image {
    public grid_position = -1;
    public grid_x: number;
    public grid_y: number;

    static readonly frames = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
    ];

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

    public updateGridPosition(
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
        this.setFrameIndex(0);
    }

    public updatePosition(
        grid: Phaser.Math.Vector3[][],
        cols: number,
        rows: number,
        countMoves: number
    ) {
        return new Promise((resolve) => {
            if (this.grid_position === -1) resolve(undefined);
            const position = this.grid_position;
            const x = grid[Math.floor(position / cols)][position % rows].x;
            const y = grid[Math.floor(position / cols)][position % rows].y;

            const tween = this.scene.tweens.add({
                targets: this,
                x: x,
                y: y,
                ease: "Linear",
                duration: countMoves * 50,
                onComplete: () => {
                    tween.remove();
                    resolve(undefined);
                },
            });
        });
    }

    public getFrameIndex() {
        return Tile.frames.indexOf(String(this.frame.name));
    }

    public setFrameIndex(index: number) {
        if(index>=Tile.frames.length) return false;
        this.setFrame(Tile.frames[index]);
        return true;
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
