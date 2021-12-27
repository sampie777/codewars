export class GameGui {
    htmlElementId = "game";

    getHtmlElement(): HTMLElement | null {
        return document.getElementById(this.htmlElementId);
    }
}
