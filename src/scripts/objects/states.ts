import {ServerMessage} from "./servermessages";

export interface PlayerState extends ServerMessage {
    acceleration?: number
    rotation?: number
}

export interface GameStatePlayer {
    id: number
    name: string
    x: number
    y: number
    size: number
    heading: number
}

export interface GameState extends ServerMessage {
    name: string
    x: number
    y: number
    size: number
    heading: number
    players: Array<GameStatePlayer>
}
