import Tile from "./Tile";

export default class TileManager extends Phaser.GameObjects.Group {
    private cols: number;
    private rows: number;
    private grid: Phaser.Math.Vector3[][];
    private rnd = new Phaser.Math.RandomDataGenerator([
        `${Phaser.Math.Between(0, 1000)}`,
    ]);

    constructor(
        scene: Phaser.Scene,
        cols: number,
        rows: number,
        grid: Phaser.Math.Vector3[][]
    ) {
        super(scene);

        this.cols = cols;
        this.rows = rows;
        this.grid = grid;

        this.initTiles();
        this.scene.add.existing(this);
    }

    public createTile() {
        const positionsAll = this.grid.flat().map((element) => element.z);
        const childs = this.getMatching("active", true);
        const positionsBusy = childs.map((element: Tile) => {
            return element.grid_position;
        });

        const positionsAllPhaser = new Phaser.Structs.Set(positionsAll);
        const positionsBusyPhaser = new Phaser.Structs.Set(positionsBusy);
        const positionsFreePhaser =
            positionsAllPhaser.difference(positionsBusyPhaser);

        if (positionsFreePhaser.size === 0) {
            return false;
        }

        const tileid = this.rnd.pick(positionsFreePhaser.getArray());
        const newTile = this.getFirstDead() as Tile;
        newTile.setGridPosition(tileid, this.grid, this.cols, this.rows);
        newTile.activate();

        return true;
    }

    private destroyTile(x: number, y: number) {
        const tile = this.get(x, y);
        tile?.clear();
    }

    private initTiles() {
        for (let i = 0; i < this.cols * this.rows; i++) {
            this.add(new Tile(this.scene));
        }
    }
}
