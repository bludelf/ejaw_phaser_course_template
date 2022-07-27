import { HEIGHT, WIDTH } from "scripts/util/globals";
import { CENTER_X, CENTER_Y } from "scripts/util/globals";
import Example2 from "./Example2";

export default class UI extends Phaser.Scene {
    static score: Phaser.GameObjects.Text;
    static max_score: Phaser.GameObjects.Text;

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

        const scores = this.add.image(CENTER_X, 200, "ui-scorepanel");

        UI.score = this.add.text(CENTER_X / 1.75, 200, `${Example2.score}`, {
            fontSize: "48px",
            color: "white",
        });
        UI.score.setOrigin(0, 0.5);

        UI.max_score = this.add.text(
            CENTER_X * 1.25,
            200,
            `${Example2.max_score}`,
            {
                fontSize: "48px",
                color: "white",
            }
        );
        UI.max_score.setOrigin(0, 0.5);
    }

    static changeScore() {
        UI.score.setText(Example2.score.toString());
        UI.max_score.setText(Example2.max_score.toString());
    }
}
