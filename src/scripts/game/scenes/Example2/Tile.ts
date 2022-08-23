import { gridManager } from "scripts/util/globals";

export default class Tile extends Phaser.GameObjects.Image {
    public grid_position = -1;

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

    public setGridPosition(position: number) {
        this.grid_position = position;
        const { x, y } = gridManager.getCell(position);
        this.x = x;
        this.y = y;
    }

    public updateGridPosition(grid_x: number, grid_y: number) {
        this.grid_position = gridManager.getId(grid_x, grid_y);
    }

    public getGridPosition() {
        return gridManager.getCoords(this.grid_position);
    }

    public clearGridPosition() {
        this.grid_position = -1;
        this.setFrameIndex(0);
    }

    public updatePosition(countMoves: number) {
        return new Promise((resolve) => {
            if (this.grid_position === -1) resolve(undefined);

            const cell = gridManager.getCell(this.grid_position);

            this.scene.tweens.add({
                targets: this,
                x: cell.x,
                y: cell.y,
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
