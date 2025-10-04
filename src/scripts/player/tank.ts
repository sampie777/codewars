import {TankCanvas} from "./TankCanvas";

export interface TankProps {
    // constructor: (game: Game, previousTank?: TankProps) => any

    // User provided
    appliedForce?: number[]
    rotation?: number

    step?: (step: number) => void
    render?: (canvas: TankCanvas) => void

    // Server provided
    x?: number
    y?: number
    size?: number
    orientation?: number
  hull?: {
    x: number
    y: number
    angle: number
    vertices: {x: number, y: number}[]
  }
  leftTrack?: {
    x: number
    y: number
    angle: number
    vertices: {x: number, y: number}[]
  }
  rightTrack?: {
    x: number
    y: number
    angle: number
    vertices: {x: number, y: number}[]
  }
}

export class EmptyTank implements TankProps {
    appliedForce = [0, 0];
    rotation = 0;
    x = 0
    y = 0
    size = 0
    orientation = 0
}
