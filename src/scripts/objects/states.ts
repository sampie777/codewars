import {ServerMessage} from "./servermessages";

export interface PlayerState extends ServerMessage {
    appliedForce?: number
    rotation?: number
}

export interface GameStatePlayer {
    id: number
    name: string
    x: number
    y: number
    size: number
    orientation: number
}

export interface GameState extends ServerMessage {
    player: GameStatePlayer
    players: Array<GameStatePlayer>
}
