import Example2 from "../Example2";
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
        Example2.score = 0;

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

        Example2.score += Math.pow(2, newTile.getFrameIndex() + 1);
        return true;
    }

    public async moveTiles(dir_x: number, dir_y: number) {
        const isMoving = <Promise<unknown>[]>[Promise.resolve()];
        while (isMoving.length) {
            isMoving.length = 0;
            const childs = this.sortChilds(dir_x, dir_y);

            childs.forEach((tile: Tile) => {
                const { x, y } = tile.getGridPosition();
                const [futureX, futureY] = [x + dir_x, y + dir_y];

                const canMove = this.canMove(
                    futureX,
                    futureY,
                    tile.getFrameIndex()
                );
                if (!canMove) return;

                tile.updateGridPosition(futureX, futureY, this.cols);

                isMoving.push(
                    tile.updatePosition(this.grid, 1).then(() => {
                        if (typeof canMove === "boolean") return;

                        canMove.clear();
                        tile.upgrade();
                    })
                );
            });
            await Promise.all(isMoving);
        }

        return Promise.resolve();
    }

    private canMove(x: number, y: number, frame: number): boolean | Tile {
        if (x >= this.rows) return false;
        if (y >= this.cols) return false;
        if (x < 0) return false;
        if (y < 0) return false;

        const posGrid = this.grid[x][y].z;
        const possibleTiles = this.getMatching("grid_position", posGrid);

        if (!possibleTiles.length) return true;

        const tile = possibleTiles[0];
        if (frame === tile.getFrameIndex()) {
            return tile;
        }

        return false;
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

    private sortChilds(dir_x, dir_y) {
        const childs = this.getMatching("active", true);

        const dir = dir_x ? dir_x : dir_y;
        const size = dir_x ? Example2.grid_x_size : Example2.grid_y_size;

        return childs.sort((obj1, obj2) => {
            const grid_pos_1 = obj1.grid_position % size;
            const grid_pos_2 = obj2.grid_position % size;

            if (dir > 0) {
                return grid_pos_2 - grid_pos_1;
            } else {
                return grid_pos_1 - grid_pos_2;
            }
        });
    }
}
