import { soundManager } from "scripts/util/globals";
import GridManager from "./Example2/Grid";
import TileManager from "./Example2/TileManager";

export default class Example2 extends Phaser.Scene {
    static grid_x_size = 8;
    static grid_y_size = 8;
    static score: number;
    public max_score: number;

    public grid: GridManager;

    private tilemanager: TileManager;
    private swipe_sound: Phaser.Sound.BaseSound;

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
        this.grid = new GridManager(Example2.grid_x_size, Example2.grid_y_size);
    }

    public create() {
        this.grid.createBlankGrid(this);
        this.createTileManager();
        this.tilemanager.createTile();
        this.tilemanager.createTile();
        this.checkValueInLocalStorage();
        //this.input.keyboard.on("keydown", this.keyListener, this);
        this.input.keyboard.addListener("keyup", this.keyListener, this);
        this.game.events.emit("setScore", Example2.score, this.max_score);
        soundManager.play("game-background.mp3", {
            volume: 0.05,
            loop: true,
        });
    }

    private changeGrid(num: number) {
        if (Example2.grid_x_size + num > 8) return;
        if (Example2.grid_y_size + num < 4) return;
        Example2.grid_x_size += num;
        Example2.grid_y_size += num;
        this.restartGame();
    }

    private restartGame() {
        this.grid.clearGrid();
        this.sound.stopAll();
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
            Example2.grid_y_size
        );
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
            soundManager.play("game-best.aac", {
                volume: 0.08,
            });
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
