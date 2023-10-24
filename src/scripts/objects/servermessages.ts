export enum ServerMessageType {
    IDENTIFY = "IDENTIFY",
    PLAYER_STATE = "PLAYER_STATE",
    GAME_STATE = "GAME_STATE",
    GAME_CONFIGURATION = "GAME_CONFIGURATION",
    SERVER_INFORMATION = "SERVER_INFORMATION",
}

export interface ServerMessage {
    type: ServerMessageType
}

export interface ServerInformation extends ServerMessage {
    version: String
}
