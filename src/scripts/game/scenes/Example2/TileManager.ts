import { gridManager, scoreManager, soundManager } from "scripts/util/globals";
import Tile from "./Tile";

export default class TileManager extends Phaser.GameObjects.Group {
    private rnd = new Phaser.Math.RandomDataGenerator([
        `${Phaser.Math.Between(0, 1000)}`,
    ]);

    constructor(scene: Phaser.Scene) {
        super(scene);

        this.initTiles();
        this.scene.add.existing(this);
    }

    public createTile() {
        const positionsAll = gridManager
            .getFlatGrid()
            .map((element) => element.z);
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
        newTile.setGridPosition(tileid);
        newTile.activate();

        scoreManager.setScore(newTile.getFrameIndex());
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

                tile.updateGridPosition(futureX, futureY);

                isMoving.push(
                    tile.updatePosition(1).then(() => {
                        if (typeof canMove === "boolean") return;

                        canMove.clear();
                        tile.upgrade();
                    })
                );
            });

            await Promise.all(isMoving);
            soundManager.play("game-slide.wav");
        }

        return Promise.resolve();
    }

    private canMove(x: number, y: number, frame: number): boolean | Tile {
        if (x >= gridManager.rowsCount) return false;
        if (y >= gridManager.colsCount) return false;
        if (x < 0) return false;
        if (y < 0) return false;

        const posGrid = gridManager.getId(x, y);
        const possibleTiles = this.getMatching("grid_position", posGrid);

        if (!possibleTiles.length) return true;

        const tile = possibleTiles[0];
        if (frame === tile.getFrameIndex()) {
            return tile;
        }

        return false;
    }

    private initTiles() {
        for (let i = 0; i < gridManager.size; i++) {
            this.add(new Tile(this.scene));
        }
    }

    private sortChilds(dir_x, dir_y) {
        const childs = this.getMatching("active", true);

        const dir = dir_x ? dir_x : dir_y;
        const size = dir_x ? gridManager.rowsCount : gridManager.colsCount;

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
