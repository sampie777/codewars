import game from "../game";
import TopViewCamera from "./TopViewCamera";
import {Renderer} from "./Renderer";
import {TankCanvas} from "../player/TankCanvas";

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

        let tankCanvas: TankCanvas = {
            context: null,
            htmlElement: null,
            width: 0,
            height: 0,
        };
        try {
            tankCanvas = this.renderer.getTankCanvas();
        } catch (e) {
            console.error("Failed to get tank canvas from renderer", e);
        }

        try {
            game.player?.render?.(tankCanvas);
        } catch (e) {
            console.error("Failed to call render() on player", e);
        }

        this.framesRendered++;
        this._prepareNextStep();
    }
}
