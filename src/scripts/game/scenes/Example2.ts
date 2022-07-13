import { Data, GameObjects } from "phaser";
import { WIDTH, CENTER_X, CENTER_Y } from "scripts/util/globals";
import { Popup } from "./Example2/CustomPopup";
import { List } from "scripts/util/extra";
import TileManager from "./Example2/TileManager";

export default class Example2 extends Phaser.Scene {
    static grid_x_size = 8;
    static grid_y_size = 8;

    public grid: Phaser.Math.Vector3[][] = [];

    private tilemanager: TileManager;

    constructor() {
        super({ key: "Example2" });
    }

    public init() {
        this.init_grid();
    }

    public init_grid() {
        const grid_x_size = Example2.grid_x_size;
        const grid_y_size = Example2.grid_y_size;

        const coords = new List(grid_x_size * grid_y_size, () => ({
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
            x: CENTER_X - (grid_x_size * 100) / 2,
            y: CENTER_Y - (grid_y_size * 100) / 2,
            width: grid_x_size,
            height: grid_y_size,
            position: Phaser.Display.Align.LEFT_TOP,
        });

        coords.forEach((data, index) => {
            const grid_y = Math.floor(index / grid_x_size);
            if (this.grid[grid_y] === undefined) {
                this.grid[grid_y] = [];
            }
            this.grid[grid_y].push(
                new Phaser.Math.Vector3(data.x, data.y, index)
            );
        });
    }

    public create() {
        this.create_blank_grid();
        this.createTileManager();
        this.tilemanager.createTile();
        this.tilemanager.createTile();

        //this.input.keyboard.on("keydown", this.keyListener, this);
        this.input.keyboard.addListener("keyup", this.keyListener, this);

        this.events
    }

    public keyListener(inputedKey) {
        switch (inputedKey.key) {

            case "ArrowRight":
                console.log("You have pressed right arrow");
                this.tilemanager.createTile();
                break;

            case "ArrowLeft":
                console.log("You have pressed left arrow");
                this.tilemanager.createTile();
                break;

            case "ArrowDown":
                console.log("You have pressed down arrow");
                this.tilemanager.createTile();
                break;

            case "ArrowUp":
                console.log("You have pressed top arrow");
                this.tilemanager.createTile();
                break;
        }
    }

    public createTileManager() {
        this.tilemanager = new TileManager(
            this,
            Example2.grid_x_size,
            Example2.grid_y_size,
            this.grid
        );
    }

    public create_blank_grid() {
        this.grid.flat().forEach((element) => {
            const image = this.add.image(element.x, element.y, "ui-emptytile");
            image.setScale(0.5);
            image.setDepth(0);
        });
    }
}
