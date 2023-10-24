import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import game from "../scripts/game";
import './DevStatistics.sass';
import {
    faArrowsRotate,
    faChartColumn,
    faDisplay,
    faNetworkWired,
    faServer, faShoePrints, faTowerBroadcast,
    faUsers, faVideo
} from "@fortawesome/free-solid-svg-icons";

interface ComponentProps {
}

interface ComponentState {
    stepsPerSecond: number
    lastTotalSteps: number
    framesPerSecond: number
    lastTotalFrames: number
    hideStats: boolean
}

export default class DevStatistics extends Component<ComponentProps, ComponentState> {

    private fpsTimer?: number;
    private documentInitialTitle: string = document.title;

    constructor(props: ComponentProps) {
        super(props);

        this.state = {
            stepsPerSecond: 0,
            lastTotalSteps: 0,
            framesPerSecond: 0,
            lastTotalFrames: 0,
            hideStats: true,
        };

        this.startTimer = this.startTimer.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
        this.checkTimer = this.checkTimer.bind(this);
        this.toggleHideStats = this.toggleHideStats.bind(this);
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

    toggleHideStats() {
        this.setState({
            hideStats: !this.state.hideStats
        })
    }

    render() {
        let connectionMessage = "Disconnected";
        if (game.server.isConnected) {
            connectionMessage = "Connected; ID: " + game.server.connectionId;
        } else if (game.server.isConnecting) {
            connectionMessage = "Connecting...";
        }

        if (game.server.isConnected) {
            document.title = this.documentInitialTitle;
        } else if (game.server.isConnecting) {
            document.title = this.documentInitialTitle + " (connecting...)";
        } else {
            document.title = this.documentInitialTitle + " (disconnected)";
        }

        const serverPing = !game.server.isConnected ? undefined : <>(<FontAwesomeIcon icon={faTowerBroadcast}
                                                                                      fixedWidth/> ping: {game.server.ping} ms)</>;

        const environment = process.env.NODE_ENV === "production" ? undefined : process.env.NODE_ENV;
        const clientVersion = <>{process.env.REACT_APP_VERSION} {environment === undefined ? undefined : <>({environment})</>}</>;
        const serverVersion = <>{game.server.serverInformation === undefined ? "unknown" : game.server.serverInformation.version}</>;

        return <div className={"DevStatistics"}>
            <h4>
                <FontAwesomeIcon icon={faChartColumn} fixedWidth/>&nbsp;
                Stats&nbsp;
                <button className={"url"}
                        onClick={this.toggleHideStats}>
                    {this.state.hideStats ? "(show)" : "(hide)"}
                </button>
            </h4>
            {this.state.hideStats ? undefined : <div className={"stats"}>
                <p><FontAwesomeIcon icon={faShoePrints} fixedWidth/> {this.state.stepsPerSecond} step(s) per second</p>
                <p><FontAwesomeIcon icon={faVideo} fixedWidth/> {this.state.framesPerSecond} frame(s) per second</p>
                <p><FontAwesomeIcon icon={faArrowsRotate} fixedWidth/> Code iteration: {game.playerIteration}</p>
                <p><FontAwesomeIcon icon={faNetworkWired} fixedWidth/> {connectionMessage} {serverPing}</p>
                <p><FontAwesomeIcon icon={faUsers} fixedWidth/> Other
                    players: {game.server.lastGameState?.players.length || 0}</p>
                <p><FontAwesomeIcon icon={faDisplay} fixedWidth/> Client: {clientVersion}</p>
                <p><FontAwesomeIcon icon={faServer} fixedWidth/> Server: {serverVersion}</p>
            </div>}
        </div>;
    }
}
