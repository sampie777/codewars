import config from "./config";
import {GameState} from "./objects/states";
import {ServerMessage, ServerMessageType} from "./objects/servermessages";

export class Server {
    isConnected = false;
    isConnecting = false;
    connectionId?: number;
    lastGameState?: GameState;
    ping: number = 999;
    private socket?: WebSocket;
    private packetSendStartTime?: Date;

    constructor() {
        this.reconnect();
    }

    reconnect() {
        if (this.isConnecting) {
            return;
        }

        this.isConnecting = true;
        if (this.socket !== undefined) {
            this.socket.close();
        }

        this.socket = new WebSocket(config.serverUrl);

        this.socket.onerror = (e) => {
            console.error("[ws] Socket error", e);
            this.isConnecting = false;
        }
        this.socket.onclose = (e) => {
            if (this.isConnected || this.isConnecting) {
                console.log("[ws] Socket closed", e);
            }
            this.isConnected = false;
            this.isConnecting = false;
        }
        this.socket.onopen = () => {
            console.log("[ws] Socket opened");
            this.isConnected = true;
            this.isConnecting = false;

            this.send({
                type: ServerMessageType.IDENTIFY,
                id: this.connectionId === undefined ? null : this.connectionId,
            })
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
                break;
            case ServerMessageType.GAME_STATE:
                this.lastGameState = msg as GameState;
                this.calculatePing();
                break;
            default:
                console.log("[ws] Unhandled message received:", msg);
        }
    }

    private calculatePing() {
        if (this.packetSendStartTime === undefined) {
            return;
        }

        this.ping = (new Date()).getTime() - this.packetSendStartTime?.getTime();
        this.packetSendStartTime = undefined;
    }

    send(data: any) {
        if (!this.isConnected) {
            this.reconnect();
            return;
        }

        const stringValue = JSON.stringify(data);
        this.packetSendStartTime = new Date();
        this.socket?.send(stringValue);
    }
}
