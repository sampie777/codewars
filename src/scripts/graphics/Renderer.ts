import {TankCanvas} from "../player/TankCanvas";

export interface Renderer {
    init: () => void
    step: () => void
    onDestroy?: () => void
    getTankCanvas: () => TankCanvas
}
