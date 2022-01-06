import game from "../game";
import TopViewCamera from "./TopViewCamera";
import {Renderer} from "./Renderer";

export class Graphics {
    htmlElementId = "game";
    framesRendered = 0;
    private renderer: Renderer = new TopViewCamera();
    private destroyed = false;

    init() {
        const htmlElement = this.getHtmlElement();
        if (htmlElement != null) {
            htmlElement.innerHTML = "";
            htmlElement.style.width = game.configuration.mapWidth + "px";
            htmlElement.style.height = game.configuration.mapHeight + "px";
        }

        try {
            this.renderer.init();
        } catch (e) {
            console.error("Failed to init renderer", e);
        }

        this._prepareNextStep();
    }

    destroy() {
        this.destroyed = true;
        try {
            this.renderer.onDestroy?.();
        } catch (e) {
            console.error("Error while destroying renderer", e);
        }
    }

    getHtmlElement(): HTMLElement | null {
        return document.getElementById(this.htmlElementId);
    }

    private _prepareNextStep() {
        window.requestAnimationFrame(this.renderStep.bind(this));
    }

    renderStep() {
        if (this.destroyed) {
            return;
        }

        try {
            this.renderer.step();
        } catch (e) {
            console.error("Failed to call render() on renderer", e);
        }

        try {
            game.player?.render?.();
        } catch (e) {
            console.error("Failed to call render() on player", e);
        }

        this.framesRendered++;
        this._prepareNextStep();
    }
}
