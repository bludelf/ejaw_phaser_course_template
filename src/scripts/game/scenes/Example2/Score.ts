import { soundManager } from "scripts/util/globals";
import GridManager from "./Grid";

export default class ScoreManager {
    private maxScore: number;
    private score: number;
    private bestsound: number;

    constructor() {
        this.setMaxScore();
        this.score = 0;
        this.bestsound = 0;
    }

    public get bestScore() {
        return this.maxScore;
    }

    public get currentScore() {
        return this.score;
    }

    public restartGame() {
        this.score = 0;
        this.bestsound = 0;
    }

    public setScore(frameIndex: number) {
        this.score = this.score + Math.pow(2, frameIndex + 1);
    }

    public setMaxScore() {
        return localStorage.getItem(`Max_score${GridManager.rows}`)
            ? localStorage.getItem(`Max_score${GridManager.rows}`)
            : 4;
    }

    public checkBestScore() {
        if (!localStorage.getItem(`Max_score${GridManager.rows}`)) {
            localStorage.setItem(`Max_score${GridManager.rows}`, "4");
            return;
        }

        if (this.score > this.maxScore) {
            localStorage.setItem(
                `Max_score${GridManager.rows}`,
                String(this.currentScore)
            );
            if (this.bestsound === 0) {
                soundManager.play("game-best.aac", {
                    volume: 0.08,
                });
                this.bestsound = 1;
            }
        }

        this.maxScore = Number(
            localStorage.getItem(`Max_score${GridManager.rows}`)
        );
        return;
    }
}
