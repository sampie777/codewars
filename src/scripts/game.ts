import {TankProps} from "./tank";
import config from "./config";

class Game {
    player?: TankProps;
    playerIteration = 0;
    stepCount = 0;
    private stepTimer?: number;
    private isStepping = false;

    start() {
        if (this.stepTimer !== undefined) {
            window.clearTimeout(this.stepTimer);
        }
        this.stepTimer = window.setInterval(this._step.bind(this), 1000 / config.stepsPerSecond);
    }

    private _step() {
        if (this.isStepping) {
            console.warn("Step takes too long!");
            return;
        }

        this.isStepping = true;
        try {
            this.player?.step?.(this.stepCount);
        } catch (e) {
            console.error("Failed to execute step", e);
        }
        this.stepCount++;
        this.isStepping = false;
    }

    updatePlayerCode(newPlayer: TankProps) {
        if (this.player !== undefined) {
            newPlayer.clone?.(this.player)
        }
        this.player = newPlayer;
        this.playerIteration++;
    }
}

const game = new Game();
game.start();

export default game;
