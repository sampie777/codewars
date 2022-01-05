export interface TankProps {
    // constructor: (game: Game, previousTank?: TankProps) => any

    // User provided
    appliedForce?: number
    rotation?: number

    render?: () => void
    step?: (step: number) => void

    // Server provided
    x?: number
    y?: number
    size?: number
    orientation?: number
}

export class EmptyTank implements TankProps {
    appliedForce = 0;
    rotation = 0;
    x = 0
    y = 0
    size = 0
    orientation = 0
}
