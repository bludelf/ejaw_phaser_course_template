//Get cell from XY
//Get cell from id
//Create grid from w&h +
//Clear grid +
//Should contain w&h as static
//flat array with all id elem +
//grid need to initialize in global

import { List } from "scripts/util/extra";
import { CENTER_X, CENTER_Y } from "scripts/util/globals";

export default class GridManager {
    private rows = 8;
    private cols = 8;

    private grid: Phaser.Math.Vector3[][] = [];

    constructor() {
        this.initGrid();
    }

    public get size() {
        return this.rows * this.cols;
    }

    public changeSize(num: number) {
        this.rows += num;
        this.cols += num;
    }

    public get rowsCount() {
        return this.rows;
    }

    public get colsCount() {
        return this.cols;
    }

    public getGrid() {
        return this.grid;
    }

    public restartGrid() {
        this.clearGrid();
        this.initGrid();
    }

    public initGrid() {
        const coords = new List(this.rows * this.cols, () => ({
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            originX: 1,
            originY: 1,
        }));

        Phaser.Actions.GridAlign(coords as any, {
            cellWidth: 100,
            cellHeight: 100,
            x: CENTER_X - (this.rows * 100) / 2,
            y: CENTER_Y - (this.cols * 100) / 2,
            width: this.rows,
            height: this.cols,
            position: Phaser.Display.Align.LEFT_TOP,
        });

        coords.forEach((data, index) => {
            const grid_y = Math.floor(index / this.rows);
            if (this.grid[grid_y] === undefined) {
                this.grid[grid_y] = [];
            }
            this.grid[grid_y].push(
                new Phaser.Math.Vector3(data.x, data.y, index)
            );
        });
        console.log(this.grid);
    }

    public getFlatGrid() {
        return this.grid.flat();
    }

    public clearGrid() {
        this.grid = [];
    }

    public getCoords(id: number) {
        return {
            x: Math.floor(id / this.cols),
            y: id % this.rows,
        };
    }

    public getCell(id: number) {
        const { x, y } = this.getCoords(id);
        return this.grid[x][y];
    }

    public getId(x: number, y: number) {
        return this.grid[x][y].z;
    }

    public checkGridSize(x, y) {
        if (x >= this.rows) return false;
        if (y >= this.cols) return false;
        if (x < 0) return false;
        if (y < 0) return false;

        return true;
    }
}
