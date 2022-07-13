export default class Tile extends Phaser.GameObjects.Image {
    public grid_position = -1;

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
    }

    public clearGridPosition() {
        this.grid_position = -1;
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
