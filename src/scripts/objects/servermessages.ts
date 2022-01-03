export enum ServerMessageType {
    IDENTIFY = "IDENTIFY",
    PLAYER_STATE = "PLAYER_STATE",
    GAME_STATE = "GAME_STATE",
    GAME_CONFIGURATION = "GAME_CONFIGURATION",
}

export interface ServerMessage {
    type: ServerMessageType
}
