import { CENTER_X, CENTER_Y, HEIGHT, WIDTH } from "scripts/util/globals";
import GridManager from "./Example2/Grid";

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
        this.add
            .sprite(CENTER_X, CENTER_Y - 30, "ui", "Background.png")
            .setOrigin(0.5, 0.5);

        //const restart = this.add.image(100, 100, "ui-restart");
        this.add.sprite(CENTER_X, 100, "ui", "Panel_header.png");

        const restart = this.add.sprite(135, 97, "ui", "Restart_Button.png");

        this.add
            .text(135, 97, `RESTART`, {
                fontSize: "36px",
                color: "#5f534f",
                fontFamily: "impact_ttf",
            })
            .setOrigin(0.5, 0.5);

        restart.setInteractive();
        restart.on(
            "pointerdown",
            () => {
                this.game.events.emit("restartGame");
            },
            this
        );

        const gridLower = this.add.sprite(800, 97, "ui", "Bigger_button.png");
        const gridBigger = this.add.sprite(640, 97, "ui", "Smaller_button.png");

        this.add.sprite(720, 97, "ui", "size_number.png");
        const grid_size_pallet = this.add
            .text(720, 97, `${GridManager.rows}x${GridManager.cols}`, {
                fontSize: "36px",
                color: "#362f2d",
                fontFamily: "impact_ttf",
            })
            .setOrigin(0.5, 0.5);

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

        this.add.sprite(CENTER_X, 97, "ui", "Score_pallet.png");

        const score = this.add
            .text(CENTER_X, 97, `SCORE: 4`, {
                fontSize: "36px",
                color: "#362f2d",
                fontFamily: "impact_ttf",
            })
            .setOrigin(0.5);

        this.add.sprite(CENTER_X, HEIGHT - 70, "ui", "Panel_footer.png");

        this.add.sprite(CENTER_X, HEIGHT - 72, "ui", "Best_score.png");
        const ms = localStorage.getItem(`Max_score${GridManager.rows}`)
            ? localStorage.getItem(`Max_score${GridManager.rows}`)
            : 4;
        const max_score = this.add
            .text(CENTER_X, HEIGHT - 72, `${ms}`, {
                fontSize: "26px",
                color: "#362f2d",
                fontFamily: "impact_ttf",
            })
            .setOrigin(0.5, 0.5);

        this.game.events.on("setScore", (current: number, max: number) => {
            score.setText("SCORE: " + current.toString());
            max_score.setText("" + max.toString());
            grid_size_pallet.setText(`${GridManager.rows}x${GridManager.cols}`);
        });
    }
}
