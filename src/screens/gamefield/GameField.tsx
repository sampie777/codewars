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
            <div className={"game"}
                 id={game.graphics.htmlElementId}
                 tabIndex={0}/>
        </div>;
    }
}
