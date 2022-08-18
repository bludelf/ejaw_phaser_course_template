//Get cell from XY
//Get cell from id
//Create grid from w&h +
//Clear grid +
//Should contain w&h as static
//flat array with all id elem +
//grid need to initialize in global

import { List } from "scripts/util/extra";
import { CENTER_X, CENTER_Y, grid } from "scripts/util/globals";
import Tile from "./Tile";

export default class GridManager {
    public rows: number;
    public cols: number;

    constructor(grid_x_size: number, grid_y_size: number) {
        this.rows = grid_x_size;
        this.cols = grid_y_size;
        this.initGrid();
    }

    public getGrid() {
        return grid;
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
            if (grid[grid_y] === undefined) {
                grid[grid_y] = [];
            }
            grid[grid_y].push(new Phaser.Math.Vector3(data.x, data.y, index));
        });

        console.log("Grid created");
    }

    public createBlankGrid(scene: Phaser.Scene) {
        this.getFlatGrid().forEach((element) => {
            const image = scene.add.sprite(
                element.x,
                element.y,
                "ui",
                "empy_tile.png"
            );
            image.setScale(0.95);
            image.setDepth(0);
        });
        console.log("blank Grid created");
    }

    public getFlatGrid() {
        console.log(grid);
        console.log(grid.flat());
        return grid.flat();
    }

    public clearGrid() {
        grid.length = 0;
    }

    public setGridPosition(position: number, tile: Tile) {
        tile.grid_position = position;
        tile.x = grid[Math.floor(position / this.cols)][position % this.rows].x;
        tile.y = grid[Math.floor(position / this.cols)][position % this.rows].y;
        tile.grid_x = Math.floor(position / this.cols);
        tile.grid_y = position % this.rows;
    }

    public getGridX(grid_x, grid_y) {
        return grid[grid_x][grid_y].x;
    }
    public getGridY(grid_x, grid_y) {
        return grid[grid_x][grid_y].y;
    }
}
