import { List } from "scripts/util/extra";
import { CENTER_X, CENTER_Y } from "scripts/util/globals";
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
        const restart = this.add.image(100, 100, "ui-restart");
        restart.setScale(0.5);

        restart.setInteractive();
        restart.on(
            "pointerdown",
            () => {
                this.restartGame();
            },
            this
        );

        //localstorage  - для максимального скора.

        //Стоит ли использовать методы button Phaser3 https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-buttons/
        //Как правильно поставить кнопки, не в статические координаты. Или лучше в статические.
        const gridBigger = this.add.image(500, 100, "ui-coin");
        const gridLower = this.add.image(300, 100, "ui-warning");

        gridBigger.setInteractive();
        gridLower.setInteractive();

        gridBigger.on(
            "pointerdown",
            () => {
                this.changeGrid(2);
            },
            this
        );
        gridLower.on(
            "pointerdown",
            () => {
                this.changeGrid(-2);
            },
            this
        );

        this.events;
    }

    private changeGrid(num: number) {
        if (Example2.grid_x_size + num > 8) return;
        if (Example2.grid_y_size + num < 4) return;
        Example2.grid_x_size += num;
        Example2.grid_y_size += num;
        this.restartGame();
    }

    private restartGame() {
        this.grid = [];
        this.scene.stop();
        this.scene.start("Example2");
    }

    public keyListener(inputedKey) {
        this.input.keyboard.enabled = false;
        const dir = { x: 0, y: 0 };
        switch (inputedKey.key) {
            case "ArrowRight":
                dir.x = 1;
                dir.y = 0;
                break;

            case "ArrowLeft":
                dir.x = -1;
                dir.y = 0;
                break;

            case "ArrowDown":
                dir.x = 0;
                dir.y = 1;
                break;

            case "ArrowUp":
                dir.x = 0;
                dir.y = -1;
                break;
        }

        this.tilemanager.moveTiles(dir.y, dir.x).then(() => {
            this.input.keyboard.enabled = true;
            this.tilemanager.createTile();
            this.tilemanager.createTile();
        });
    }

    public createTileManager() {
        console.log(
            Example2.grid_x_size,
            "=================================x+=========="
        );
        console.log(
            Example2.grid_y_size,
            "=================================y+=========="
        );
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
