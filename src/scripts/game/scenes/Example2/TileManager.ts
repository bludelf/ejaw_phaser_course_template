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

    public moveTiles(dir_x: number, dir_y: number) {
        const promises = new Array();
        const childs = this.getMatching("active", true);
        childs.sort((obj1, obj2) => {
            const grid_pos_1 = obj1.position % Example2.grid_x_size;
            const grid_pos_2 = obj2.position % Example2.grid_x_size;

            return grid_pos_2 - grid_pos_1
        })
        
        childs.sort((a,b) => a.grid_x > b.grid_x? 1 : -1)
        console.log(childs);
        let loop = true;
        while(loop){
            loop = false;
            for (let i = 0; i < childs.length; i++) {
                const child = childs[i];
                let { x, y } = child.getGridPosition();
                x = x + dir_x;
                y = y + dir_y;
                let countMoves = 0;
    
                while (this.canMove(x, y, child.getFrameIndex())) {
                    const posGrid = this.grid[x][y].z;
                    child.updateGridPosition(
                        posGrid,
                        this.grid,
                        this.cols,
                        this.rows
                    );
                    x = x + dir_x;
                    y = y + dir_y;
                    countMoves++;
                    loop = true;
                }
    
                promises.push(
                    child.updatePosition(
                        this.grid,
                        this.cols,
                        this.rows,
                        countMoves
                    )
                );
    
                const possibleTiles = this.getMatching(
                    "grid_position",
                    child.grid_position
                );
    
                if (possibleTiles.length > 1) {
                    possibleTiles[0].setFrameIndex(
                        possibleTiles[0].getFrameIndex() + 1
                    );
    
                    possibleTiles[1].clear();
                }
            }
        }        

        return Promise.all(promises);
    }

    private canMove(x, y, frame) {
        if (x >= this.rows) return false;
        if (y >= this.cols) return false;
        if (x < 0) return false;
        if (y < 0) return false;
        const posGrid = this.grid[x][y].z;
        const possibleTiles = this.getMatching("grid_position", posGrid);
        if (possibleTiles.length) {
            if (frame === possibleTiles[0].getFrameIndex()) {
                return true;
            }

            return false;
        }

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
