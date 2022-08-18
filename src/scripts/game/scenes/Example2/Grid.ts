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
    static rows = 8;
    static cols = 8;

    private grid: Phaser.Math.Vector3[][] = [];

    constructor() {
        this.initGrid();
    }

    public get size() {
        return GridManager.rows * GridManager.cols;
    }

    public getGrid() {
        return this.grid;
    }

    public initGrid() {
        const coords = new List(GridManager.rows * GridManager.cols, () => ({
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
            x: CENTER_X - (GridManager.rows * 100) / 2,
            y: CENTER_Y - (GridManager.cols * 100) / 2,
            width: GridManager.rows,
            height: GridManager.cols,
            position: Phaser.Display.Align.LEFT_TOP,
        });

        coords.forEach((data, index) => {
            const grid_y = Math.floor(index / GridManager.rows);
            if (this.grid[grid_y] === undefined) {
                this.grid[grid_y] = [];
            }
            this.grid[grid_y].push(
                new Phaser.Math.Vector3(data.x, data.y, index)
            );
        });
    }

    public getFlatGrid() {
        return this.grid.flat();
    }

    public clearGrid() {
        this.grid.length = 0;
    }

    public getXYbyId(id: number) {
        return {
            x: Math.floor(id / GridManager.cols),
            y: id % GridManager.rows,
        };
    }

    public getByID(id: number) {
        const { x, y } = this.getXYbyId(id);
        return this.grid[x][y];
    }

    public getIDbyXY(x: number, y: number) {
        return this.grid[x][y].z;
    }
}
