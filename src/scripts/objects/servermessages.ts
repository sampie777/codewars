export enum ServerMessageType {
    IDENTIFY = "IDENTIFY",
    PLAYER_STATE = "PLAYER_STATE",
    GAME_STATE = "GAME_STATE",
}

export interface ServerMessage {
    type: ServerMessageType
}
