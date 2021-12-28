import {Game} from "./game";

export interface TankProps {
    // constructor: (game: Game, previousTank?: TankProps) => any

    // User provided
    acceleration?: number
    rotation?: number

    render?: () => void
    step?: (step: number) => void

    // Server provided
    x?: number
    y?: number
    size?: number
    heading?: number
}

export class EmptyTank implements TankProps {
    acceleration = 0;
    rotation = 0;
    x = 0
    y = 0
    size = 0
    heading = 0

    render() {
        // Render your own GUI here
    }

    step(step: number) {
        // Determine new acceleration and rotation values here
    }
}
