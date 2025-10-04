import {ServerMessage} from "./servermessages";

export interface PlayerState extends ServerMessage {
    appliedForce?: number[]
}

export interface GameStatePlayer {
    id: number
    name: string
    x: number
    y: number
    size: number
    orientation: number
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

export interface GameState extends ServerMessage {
    player: GameStatePlayer
    players: Array<GameStatePlayer>
}
