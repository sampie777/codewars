import {Renderer} from "./Renderer";
import game from "../game";
import {GameStatePlayer} from "../objects/states";
import {degToRad} from "./utils";

export default class TopViewCamera implements Renderer {
    private width: number = 0;
    private height: number = 0;
    private canvas?: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null = null;

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

    step() {
        if (this.context == null) {
            return;
        }
        this.clear();
        this.paintPlayers();
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

        this.context!.beginPath();
        this.context!.fillStyle = "#d44";
        this.context!.arc(player.x || 0, player.y || 0, (player.size || 0) / 2,
            0, 2 * Math.PI);
        this.context!.fill();

        this.context!.beginPath();
        this.context!.fillStyle = "#400";
        this.context!.arc(player.x || 0, player.y || 0, (player.size || 0) / 2,
            degToRad((player.heading || 0) - 65), degToRad((player.heading || 0) + 65));
        this.context!.fill();
    }

    paintPlayer() {
        if (game.player === undefined) {
            return;
        }

        this.context!.beginPath();
        this.context!.fillStyle = "#0a0";
        this.context!.arc(game.player.x || 0, game.player.y || 0, (game.player.size || 0) / 2,
            0, 2 * Math.PI);
        this.context!.fill();

        this.context!.beginPath();
        this.context!.fillStyle = "#050";
        this.context!.arc(game.player.x || 0, game.player.y || 0, (game.player.size || 0) / 2,
            degToRad((game.player.heading || 0) - 65 - 90), degToRad((game.player.heading || 0) + 65 - 90));
        this.context!.fill();
    }
}
