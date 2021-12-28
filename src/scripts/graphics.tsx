import {Game} from "./game";

export class Graphics {
    htmlElementId = "game";
    framesPainted = 0;
    private game: Game;

    constructor(game: Game) {
        this.game = game;
        this._prepareNextStep();
    }

    getHtmlElement(): HTMLElement | null {
        return document.getElementById(this.htmlElementId);
    }

    private _prepareNextStep() {
        window.requestAnimationFrame(this.renderStep.bind(this));
    }

    renderStep() {
        try {
            this.game.player?.render?.();
        } catch (e) {
            console.error("Failed to call render() on player", e);
        }
        this.framesPainted++;
        this._prepareNextStep();
    }
}
