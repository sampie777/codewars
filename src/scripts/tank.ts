export interface TankProps {
    // User provided
    acceleration?: number
    rotation?: number

    clone?: (previousObj: Object) => void
    render?: () => void
    step?: (step: number) => void

    // Server provided
    x?: number
    y?: number
    size?: number
    heading?: number
}