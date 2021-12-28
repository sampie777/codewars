import React, {Component} from 'react';
import game from "../scripts/game";
import './DevStatistics.sass';

interface ComponentProps {
}

interface ComponentState {
    stepsPerSecond: number
    lastTotalSteps: number
    framesPerSecond: number
    lastTotalFrames: number
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
        };

        this.startTimer = this.startTimer.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
        this.checkTimer = this.checkTimer.bind(this);
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
            framesPerSecond: game.graphics.framesPainted - this.state.lastTotalFrames,
            lastTotalFrames: game.graphics.framesPainted,
        });
    }

    render() {
        let connectionMessage = "disconnected";
        if (game.server.isConnected) {
            connectionMessage = "connected with ID: " + game.server.connectionId;
        } else if (game.server.isConnecting) {
            connectionMessage = "connecting...";
        }

        return <div className={"DevStatistics"}>
            <h4>Stats</h4>
            <p>{this.state.stepsPerSecond} step(s) per second.</p>
            <p>{this.state.framesPerSecond} frame(s) per second.</p>
            <p>Code iteration: {game.playerIteration}</p>
            <p>Websocket: {connectionMessage} (ping: {game.server.ping} ms)</p>
            <p>Other players: {game.server.lastGameState?.players.length || 0}</p>
        </div>;
    }
}
