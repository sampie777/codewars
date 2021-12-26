export interface TankProps {
    acceleration: number
    clone?: (previousObj: Object) => void
    render?: () => void
    step?: (step: number) => void
}
