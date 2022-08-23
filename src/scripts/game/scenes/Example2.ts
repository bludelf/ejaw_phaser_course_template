import { gridManager, scoreManager, soundManager } from "scripts/util/globals";
import TileManager from "./Example2/TileManager";

export default class Example2 extends Phaser.Scene {
    private tilemanager: TileManager;

    constructor() {
        super({ key: "Example2" });
    }

    public init() {
        this.cameras.main.zoom = 1;

        this.game.events.on("changeGrid", this.changeGrid.bind(this));
        this.game.events.on("restartGame", this.restartGame.bind(this));
        this.events.once("shutdown", () => {
            this.game.events.off("changeGrid");
            this.game.events.off("restartGame");
        });
        scoreManager.updateBestScore();
        this.game.events.emit("setScore");
        this.cameras.main.zoom = 1 / (gridManager.rowsCount / 8);
    }

    public create() {
        this.create_blank_grid();
        this.createTileManager();
        this.tilemanager.createTile();
        this.tilemanager.createTile();
        scoreManager.updateBestScore();
        this.input.keyboard.addListener("keyup", this.keyListener, this);
        this.game.events.emit("setScore");
        soundManager.play("game-background.mp3", {
            volume: 0.05,
            loop: true,
        });
    }

    private changeGrid(num: number) {
        if (gridManager.rowsCount + num > 8) return;
        if (gridManager.colsCount + num < 4) return;
        gridManager.changeSize(num);
        this.restartGame();
    }

    private restartGame() {
        gridManager.restartGrid();
        scoreManager.restartGame();
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
            scoreManager.updateBestScore();
            this.game.events.emit("setScore");
        });
    }

    public createTileManager() {
        this.tilemanager = new TileManager(this);
    }

    public create_blank_grid() {
        gridManager.getFlatGrid().forEach((element) => {
            const image = this.add.sprite(
                element.x,
                element.y,
                "ui",
                "empy_tile.png"
            );
            image.setScale(0.95);
            image.setDepth(0);
        });
    }

    public changeScore() {
        return;
    }
}
