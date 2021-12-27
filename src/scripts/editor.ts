import {TankProps} from "./tank";
import game from "./game";

export const runUserCode = (script: string): string | undefined => {
    try {
        const clazz = new Function(script + "; return Tank;");
        const constructor = clazz();
        const player = new constructor(game) as TankProps;
        game.updatePlayerCode(player);
    } catch (e) {
        console.error("Failed to execute user code:", e);
        return String(e);
    }
    return undefined;
}
