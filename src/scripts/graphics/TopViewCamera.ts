import { Renderer } from "./Renderer";
import game from "../game";
import { GameStatePlayer } from "../objects/states";
import { degToRad, loadImage, radToDeg } from "./utils";
import tankBlue from "../../assets/sprites/tank_blue.svg";
import tankRed from "../../assets/sprites/tank_red.svg";
import { TankCanvas } from "../player/TankCanvas";

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
  }

  clear() {
    this.context!.clearRect(0, 0, this.width, this.height);
  }

  getTankCanvas(): TankCanvas {
    return {
      context: this.context,
      htmlElement: this.canvas || null,
      width: this.width,
      height: this.height,
    }
  }

  paintPlayers() {
    // game.server.lastGameState?.players.forEach(player => this.paintOtherPlayer(player));
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


    this.context!.font = "20px Arial";
    this.context!.fillText(`Angle: ${radToDeg(game.player.hull?.angle || 0).toFixed(0)}`,10,40);

    this.drawObj2(game.player.hull, "green")
    this.drawObj2(game.player.leftTrack, "blue")
    this.drawObj2(game.player.rightTrack, "red")
  }

  drawObj2(obj: {
    x: number
    y: number
    angle: number
    vertices: { x: number, y: number }[]
  } | undefined, color: string) {
    if (!obj) return;


    this.context!.save();
    this.context!.translate(obj.x, obj.y);
    this.context!.rotate(obj.angle);

    this.context!.strokeStyle = color;
    this.context!.lineWidth = 5;
    this.context!.beginPath();
    this.context!.moveTo(
      obj.vertices[0].x,
      obj.vertices[0].y)
    obj.vertices.forEach(it =>
      this.context!.lineTo(
        it.x,
        it.y))
    this.context!.lineTo(
      obj.vertices[0].x,
      obj.vertices[0].y)
    this.context?.stroke()

    this.context!.restore();
  }
}
