import game from "../game";
import TopViewCamera from "./TopViewCamera";
import {Renderer} from "./Renderer";

export class Graphics {
    htmlElementId = "game";
    framesPainted = 0;
    private renderer: Renderer = new TopViewCamera();

    init() {
        this.renderer.init();
        this._prepareNextStep();
    }

    getHtmlElement(): HTMLElement | null {
        return document.getElementById(this.htmlElementId);
    }

    private _prepareNextStep() {
        window.requestAnimationFrame(this.renderStep.bind(this));
    }

    renderStep() {
        this.renderer.step();

        try {
            game.player?.render?.();
        } catch (e) {
            console.error("Failed to call render() on player", e);
        }

        this.framesPainted++;
        this._prepareNextStep();
    }
}