import React, {Component} from 'react';
import './style.sass';
import game from "../../scripts/game";

interface ComponentProps {
}

interface ComponentState {
}

export default class GameField extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    render() {
        return <div className={"GameField"}>
            <h1>Game</h1>
            <div id={game.gui.htmlElementId}/>
        </div>;
    }
}
