import {Game} from "./game";

export interface TankProps {
    constructor: (game: Game, previousTank?: TankProps) => TankProps

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
