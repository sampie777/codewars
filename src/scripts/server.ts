import config from "./config";
import {GameState} from "./objects/states";
import {ServerMessage, ServerMessageType} from "./objects/servermessages";

export class Server {
    isConnected = false;
    isConnecting = false;
    connectionId?: number;
    lastGameState?: GameState;
    private socket?: WebSocket;

    constructor() {
        this.reconnect();
    }

    reconnect() {
        if (this.isConnecting) {
            return;
        }

        this.isConnecting = true;
        this.socket = new WebSocket(config.serverUrl);

        this.socket.onerror = (e) => {
            console.error("[ws] Socket error", e);
            this.isConnecting = false;
        }
        this.socket.onclose = (e) => {
            console.log("[ws] Socket closed", e);
            this.isConnected = false;
            this.isConnecting = false;
        }
        this.socket.onopen = () => {
            console.log("[ws] Socket opened");
            this.isConnected = true;
            this.isConnecting = false;
        }
        this.socket.onmessage = (e) => {
            this.isConnected = true;
            this.isConnecting = false;

            const msg = JSON.parse(e.data) as ServerMessage & any;
            this.handleMessage(msg);
        }
    }

    private handleMessage(msg: ServerMessage & any) {
        switch (msg.type) {
            case ServerMessageType.IDENTIFY:
                this.connectionId = msg.id;
                console.log("[ws] I'm identified as " + this.connectionId);
                break;
            case ServerMessageType.GAME_STATE:
                this.lastGameState = msg as GameState;
                break;
            default:
                console.log("[ws] Unhandled message received:", msg);
        }
    }

    send(data: any) {
        if (!this.isConnected) {
            this.reconnect();
            return;
        }

        const stringValue = JSON.stringify(data);
        this.socket?.send(stringValue);
    }
}
