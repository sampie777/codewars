import {TankProps} from "./tank";
import game from "./game";

export const runUserCode = (script: string): string | undefined => {
    try {
        const constructor = new Function(script + "; return new Tank();");
        const player = constructor() as TankProps;
        game.updatePlayerCode(player);
    } catch (e) {
        console.error("Failed to execute user code:", e);
        return String(e);
    }
    return undefined;
}
