import {EmptyTank, TankProps} from "./player/tank";
import config from "./config";
import {Graphics} from "./graphics/graphics";
import {Server} from "./server";
import {PlayerState} from "./objects/states";
import {ServerMessageType} from "./objects/servermessages";
import {GameConfiguration} from "./objects/gameConfiguration";

export class Game {
    configuration = new GameConfiguration();
    graphics = new Graphics();
    server = new Server();

    stepCount = 0;
    playerIteration = 0;
    player: TankProps = new EmptyTank();

    private stepTimer?: number;
    private isStepping = false;

    start() {
        if (this.stepTimer !== undefined) {
            window.clearTimeout(this.stepTimer);
        }
        this.stepTimer = window.setInterval(this._step.bind(this), 1000 / config.stepsPerSecond);

        this.graphics.init();
    }

    private _step() {
        if (this.isStepping) {
            console.warn("Step takes too long!");
            return;
        }
        if (!this.server.isConnected) {
            // Why bother taking steps when not connected?
            this.server.reconnect();
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
        this.player = newPlayer;
        this.playerIteration++;
    }

    retrievePlayerState() {
        if (this.player === undefined) {
            return;
        }

        if (this.server.lastGameState === undefined) {
            return;
        }

        const state = this.server.lastGameState;

        this.player.x = state.player.x;
        this.player.y = state.player.y;
        this.player.size = state.player.size;
        this.player.orientation = state.player.orientation;
    }

    sendPlayerState() {
        if (this.player === undefined) {
            return this.server.send({type: ServerMessageType.GAME_STATE});
        }

        const state: PlayerState = {
            type: ServerMessageType.PLAYER_STATE,
            appliedForce: this.player.appliedForce,
            rotation: this.player.rotation,
        }

        this.server.send(state);
    }

    setConfiguration(configuration: GameConfiguration) {
        this.configuration = configuration;
        this.resetGraphics();
    }

    private resetGraphics() {
        this.graphics.destroy();
        this.graphics = new Graphics();
        this.graphics.init();
    }
}

const game = new Game();
export default game;
