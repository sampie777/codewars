import config from "./config";
import {GameState} from "./objects/states";
import {ServerMessage, ServerMessageType} from "./objects/servermessages";
import game from "./game";
import {GameConfiguration} from "./objects/gameConfiguration";

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
            this.waitTillClosed(() => this.reconnect());
            return;
        }

        this.socket = new WebSocket(this.generateServerUrl());

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
            this.socket = undefined;
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

    private generateServerUrl(): string {
        if (config.serverUseSecureConnection) {
            return config.serverUrl.replace(new RegExp("^ws://"), "wss://")
        }
        return config.serverUrl.replace(new RegExp("^wss://"), "ws://")
    }

    private waitTillClosed(callback: () => void, timeoutTime: Date | undefined = undefined) {
        if (timeoutTime === undefined) {
            timeoutTime = new Date((new Date()).getTime() + config.socketWaitTillClosedTimeout);
        }

        if ((this.isConnected || this.socket !== undefined) && timeoutTime.getTime() > (new Date()).getTime()) {
            return callback();
        }

        setTimeout(() => this.waitTillClosed(callback, timeoutTime), 100);
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
            case ServerMessageType.GAME_CONFIGURATION:
                const configuration = msg as GameConfiguration;
                game.setConfiguration(configuration)
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
