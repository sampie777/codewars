import React, {Component} from 'react';
import game from "../scripts/game";
import './DevStatistics.sass';
import config from "../scripts/config";

interface ComponentProps {
}

interface ComponentState {
    stepsPerSecond: number
    lastTotalSteps: number
    framesPerSecond: number
    lastTotalFrames: number
    useSecureConnection: boolean
}

export default class DevStatistics extends Component<ComponentProps, ComponentState> {

    fpsTimer?: number;

    constructor(props: ComponentProps) {
        super(props);

        this.state = {
            stepsPerSecond: 0,
            lastTotalSteps: 0,
            framesPerSecond: 0,
            lastTotalFrames: 0,
            useSecureConnection: config.serverUseSecureConnection,
        };

        this.startTimer = this.startTimer.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
        this.checkTimer = this.checkTimer.bind(this);
        this.toggleSecureConnection = this.toggleSecureConnection.bind(this);
    }

    componentDidMount() {
        this.startTimer();
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    startTimer() {
        this.clearTimer();
        this.fpsTimer = window.setInterval(this.checkTimer, 1000);
    }

    clearTimer() {
        if (this.fpsTimer !== undefined) {
            window.clearTimeout(this.fpsTimer);
        }
    }

    checkTimer() {
        this.setState({
            stepsPerSecond: game.stepCount - this.state.lastTotalSteps,
            lastTotalSteps: game.stepCount,
            framesPerSecond: game.graphics.framesRendered - this.state.lastTotalFrames,
            lastTotalFrames: game.graphics.framesRendered,
        });
    }

    toggleSecureConnection(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            useSecureConnection: e.target.checked
        }, () => {
            config.serverUseSecureConnection = this.state.useSecureConnection;
            game.server.reconnect();
        });
    }

    render() {
        let connectionMessage = "disconnected";
        if (game.server.isConnected) {
            connectionMessage = "connected with ID: " + game.server.connectionId;
        } else if (game.server.isConnecting) {
            connectionMessage = "connecting...";
        }

        const serverPing = !game.server.isConnected ? undefined : <>(ping: {game.server.ping} ms)</>;

        const environment = process.env.NODE_ENV === "production" ? undefined : process.env.NODE_ENV;
        const clientVersion = <>{process.env.REACT_APP_VERSION} {environment === undefined ? undefined : <>({environment})</>}</>;
        const serverVersion = <>{game.server.serverInformation === undefined ? "unknown" : game.server.serverInformation.version}</>;

        return <div
            className={"DevStatistics"}>
            <h4>Stats</h4>
            <p>{this.state.stepsPerSecond} step(s) per second.</p>
            <p>{this.state.framesPerSecond} frame(s) per second.</p>
            <p>Code iteration: {game.playerIteration}</p>
            <p>
                Websocket&nbsp;
                (
                <label>
                    <input type={"checkbox"}
                           onChange={this.toggleSecureConnection}
                           checked={this.state.useSecureConnection}/>
                    SSL
                </label>
                ):&nbsp;
                {connectionMessage} {serverPing}
            </p>
            <p>Other players: {game.server.lastGameState?.players.length || 0}</p>
            <p>Client: {clientVersion} -
                Server: {serverVersion}</p>
        </div>;
    }
}
