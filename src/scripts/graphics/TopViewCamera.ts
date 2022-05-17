import {Renderer} from "./Renderer";
import game from "../game";
import {GameStatePlayer} from "../objects/states";
import {degToRad, loadImage} from "./utils";
import tankBlue from "../../assets/sprites/tank_blue.svg";
import tankRed from "../../assets/sprites/tank_red.svg";

export default class TopViewCamera implements Renderer {
    private width: number = 0;
    private height: number = 0;
    private canvas?: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null = null;
    private playerSprite?: HTMLImageElement;
    private otherPlayerSprite?: HTMLImageElement;

    init() {
        const gameElement = game.graphics.getHtmlElement();
        if (gameElement == null) {
            console.error("Game DOM element not found");
            return;
        }

        this.width = gameElement.getBoundingClientRect().width;
        this.height = gameElement.getBoundingClientRect().height;

        this.createCanvas(gameElement);
        this.createContext();
        this.clear();
        this.loadSprites();
    }

    private createCanvas(parentElement: HTMLElement) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas";
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        parentElement.appendChild(this.canvas);
    }

    private createContext() {
        this.context = this.canvas!.getContext("2d");
        if (this.context == null) {
            console.error("Failed to create 2D context for canvas");
        }
    }

    private loadSprites() {
        loadImage(tankBlue, (result) => this.playerSprite = result);
        loadImage(tankRed, (result) => this.otherPlayerSprite = result);
    }

    step() {
        if (this.context == null) {
            return;
        }
        this.clear();
        this.paintPlayers();
        this.paintStatistics();
    }

    clear() {
        this.context!.clearRect(0, 0, this.width, this.height);
    }

    paintPlayers() {
        game.server.lastGameState?.players.forEach(player => this.paintOtherPlayer(player));
        this.paintPlayer();
    }

    paintOtherPlayer(player: GameStatePlayer) {
        if (player === undefined || player === null) {
            return;
        }

        if (!this.otherPlayerSprite) {
            // In case spirte isn't loading, show something temporary
            this.context!.beginPath();
            this.context!.fillStyle = "#d44";
            this.context!.arc(player.x || 0, player.y || 0, (player.size || 0) / 2,
                0, 2 * Math.PI);
            this.context!.fill();
            return;
        }

        this.context!.save();
        this.context!.translate(player.x || 0, player.y || 0);
        this.context!.rotate(degToRad((player.orientation || 0)));
        const offset = (player.size || 0) / -2;
        this.context!.drawImage(this.otherPlayerSprite, offset, offset, player.size || 0, player.size || 0);
        this.context!.restore();
    }

    paintPlayer() {
        if (game.player === undefined) {
            return;
        }

        if (!this.playerSprite) {
            // In case spirte isn't loading, show something temporary
            this.context!.beginPath();
            this.context!.fillStyle = "#0a0";
            this.context!.arc(game.player.x || 0, game.player.y || 0, (game.player.size || 0) / 2,
                0, 2 * Math.PI);
            this.context!.fill();
            return;
        }

        this.context!.save();
        this.context!.translate(game.player.x || 0, game.player.y || 0);
        this.context!.rotate(degToRad((game.player.orientation || 0)));
        const offset = (game.player.size || 0) / -2;
        this.context!.drawImage(this.playerSprite, offset, offset, game.player.size || 0, game.player.size || 0);
        this.context!.restore();
    }

    paintStatistics() {
        try {
            this.context!.beginPath();
            this.context!.strokeStyle = "#fff";
            this.context!.font = "14px monospace";
            this.context!.textBaseline = "top";
            this.context!.textAlign = "left";
            // @ts-ignore
            const velocity = game.player.getVelocity();
            this.context!.strokeText("Velocity: " + Math.round(velocity * 10) / 10, this.width - 150, 10);
        } catch (e) {
        }
    }
}
