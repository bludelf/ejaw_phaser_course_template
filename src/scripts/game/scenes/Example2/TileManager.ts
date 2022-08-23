import {
    gridManager,
    rnd,
    scoreManager,
    soundManager,
} from "scripts/util/globals";
import Tile from "./Tile";

export default class TileManager extends Phaser.GameObjects.Group {
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

        const tileid = rnd.pick(positionsFreePhaser.getArray());
        const newTile = this.getFirstDead() as Tile;
        newTile.setGridPosition(tileid);
        newTile.activate();

        scoreManager.setScore(newTile.getFrameIndex());
        return true;
    }

    public async moveTiles(dir_x: number, dir_y: number) {
        let isMoving = <Promise<unknown>[]>[Promise.resolve()];
        while (isMoving.length) {
            const childs = this.sortChilds(dir_x, dir_y);

            isMoving = childs.reduce((arr, tile: Tile) => {
                const { x, y } = tile.getGridPosition();
                const [vx, vy] = [x + dir_x, y + dir_y];

                if (!this.canMove(vx, vy)) return arr;

                const busy = this.isBusyTile(vx, vy);

                if (busy && !this.couldUpgrade(tile, busy)) return arr;

                tile.updateGridPosition(vx, vy);

                const move = tile.updatePosition(1);

                move.then(() => this.tryUpgrade(tile, busy));

                arr.push(move);
                return arr;
            }, []);

            await Promise.all(isMoving);
            soundManager.play("game-slide.wav");
        }

        return Promise.resolve();
    }

    private tryUpgrade(tile, busy) {
        if (!busy) return;

        busy.clear();
        tile.upgrade();
    }

    private canMove(x: number, y: number): boolean {
        return gridManager.checkGridSize(x, y);
    }

    private isBusyTile(x: number, y: number) {
        const posGrid = gridManager.getId(x, y);
        const possibleTiles = this.getMatching("grid_position", posGrid);

        return possibleTiles[0];
    }

    private couldUpgrade(tile: Tile, ftile?: Tile | undefined): boolean {
        const tileFrame = tile.getFrameIndex();
        const ftileFrame = ftile?.getFrameIndex();
        if (tileFrame !== ftileFrame) return false;

        return true;
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
