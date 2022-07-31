import { List } from "scripts/util/extra";
import { CENTER_X, CENTER_Y } from "scripts/util/globals";
import TileManager from "./Example2/TileManager";
import UI from "./UI";

export default class Example2 extends Phaser.Scene {
    static grid_x_size = 8;
    static grid_y_size = 8;
    static score: number;
    public max_score: number;

    public grid: Phaser.Math.Vector3[][] = [];

    private tilemanager: TileManager;

    constructor() {
        super({ key: "Example2" });
    }

    public init() {
        this.cameras.main.zoom = 1;
        this.init_grid();

        this.game.events.on("changeGrid", this.changeGrid.bind(this));
        this.game.events.on("restartGame", this.restartGame.bind(this));
        this.events.once("shutdown", () => {
            this.game.events.off("changeGrid");
            this.game.events.off("restartGame");
        });
        this.checkValueInLocalStorage();
        this.game.events.emit("setScore", Example2.score, this.max_score);
        this.cameras.main.zoom = 1 / (Example2.grid_x_size / 8);
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
        this.checkValueInLocalStorage();
        //this.input.keyboard.on("keydown", this.keyListener, this);
        this.input.keyboard.addListener("keyup", this.keyListener, this);
        this.game.events.emit("setScore", Example2.score, this.max_score);
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
            this.checkValueInLocalStorage();
            this.game.events.emit("setScore", Example2.score, this.max_score);
        });
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

    public changeScore() {
        return;
    }

    private checkValueInLocalStorage() {
        if (!localStorage.getItem(`Max_score${Example2.grid_x_size}`)) {
            localStorage.setItem(`Max_score${Example2.grid_x_size}`, "4");
            return;
        }

        if (Example2.score > this.max_score) {
            localStorage.setItem(
                `Max_score${Example2.grid_x_size}`,
                String(Example2.score)
            );
        }

        this.max_score = Number(
            localStorage.getItem(`Max_score${Example2.grid_x_size}`)
        );
        return;
    }
}
