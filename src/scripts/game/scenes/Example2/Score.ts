import { gridManager, soundManager } from "scripts/util/globals";

export default class ScoreManager {
    private maxScore: number;
    private score: number;
    private bestsound: number;

    constructor() {
        this.getMaxScore();
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

    public getMaxScore() {
        const bestscore = localStorage.getItem(
            `Max_score${gridManager.rowsCount}`
        );
        return bestscore ? bestscore : 4;
    }

    public updateBestScore() {
        if (!localStorage.getItem(`Max_score${gridManager.rowsCount}`)) {
            localStorage.setItem(`Max_score${gridManager.rowsCount}`, "4");
            return;
        }

        if (this.score > this.maxScore) {
            localStorage.setItem(
                `Max_score${gridManager.rowsCount}`,
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
            localStorage.getItem(`Max_score${gridManager.rowsCount}`)
        );
        return;
    }
}
