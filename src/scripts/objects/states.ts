import {ServerMessage} from "./servermessages";

export interface PlayerState extends ServerMessage {
    acceleration?: number
    rotation?: number
}

export interface GameState extends ServerMessage {
    x: number
    y: number
    size: number
    heading: number
}
