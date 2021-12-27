import {TankProps} from "./tank";
import config from "./config";
import {GameGui} from "./gamegui";
import {Server, ServerMessageType} from "./server";

export class Game {
    player?: TankProps;
    playerIteration = 0;
    stepCount = 0;
    gui = new GameGui();
    server = new Server();
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

        this.retrievePlayerState();

        try {
            this.player?.step?.(this.stepCount);
        } catch (e) {
            console.error("Failed to execute step", e);
        }

        this.sendPlayerState();

        this.stepCount++;
        this.isStepping = false;
    }

    updatePlayerCode(newPlayer: TankProps) {
        if (this.player !== undefined) {
            try {
                newPlayer.clone?.(this.player);
            } catch (e) {
                console.error("Failed to clone player", e);
                return;
            }
        }

        this.player = newPlayer;
        this.playerIteration++;
    }

    retrievePlayerState() {
        if (this.player === undefined) {
            return;
        }

        // todo... download player state
        const state = {
            x: 0,
            y: 0,
            size: 0,
            heading: 0,
        }

        this.player.x = state.x;
        this.player.y = state.y;
        this.player.size = state.size;
        this.player.heading = state.heading;
    }

    sendPlayerState() {
        if (this.player === undefined) {
            return;
        }

        const state = {
            type: ServerMessageType.PLAYER_STATE,
            acceleration: this.player.acceleration,
            rotation: this.player.rotation,
        }

        this.server.send(state);
    }
}

const game = new Game();
game.start();

export default game;
