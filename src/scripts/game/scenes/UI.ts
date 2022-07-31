import { HEIGHT, WIDTH } from "scripts/util/globals";
import { CENTER_X, CENTER_Y } from "scripts/util/globals";
import Example2 from "./Example2";

export default class UI extends Phaser.Scene {

    constructor() {
        super({
            key: "UI",
        });
    }

    init() {
        this.cameras.add(0, 0, WIDTH, HEIGHT);
    }

    create() {
        const restart = this.add.image(100, 100, "ui-restart");
        restart.setScale(0.5);

        restart.setInteractive();
        restart.on(
            "pointerdown",
            () => {
                this.game.events.emit("restartGame");
            },
            this
        );

        const gridBigger = this.add.image(300, 100, "ui-coin");
        const gridLower = this.add.image(200, 100, "ui-warning");

        gridBigger.setInteractive();
        gridLower.setInteractive();

        gridBigger.on(
            "pointerdown",
            () => {
                this.game.events.emit("changeGrid", 2);
            },
            this
        );
        gridLower.on(
            "pointerdown",
            () => {
                this.game.events.emit("changeGrid", -2);
            },
            this
        );

        this.add.image(CENTER_X, 200, "ui-scorepanel");

        const score = this.add.text(CENTER_X / 1.75, 200, `4`, {
            fontSize: "48px",
            color: "white",
        }).setOrigin(0.5, 0.5);
        const ms = localStorage.getItem(`Max_score${Example2.grid_x_size}`)?localStorage.getItem(`Max_score${Example2.grid_x_size}`):4;
        console.log(ms)
        const max_score = this.add.text(CENTER_X * 1.25, 200, `${ms}`, {
            fontSize: "48px",
            color: "white",
        }).setOrigin(0.5, 0.5);

        this.game.events.on("setScore", (current:number, max: number) => {
            score.setText(current.toString());
            max_score.setText(max.toString());
        });
    }
}
