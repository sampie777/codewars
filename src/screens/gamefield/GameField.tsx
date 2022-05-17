import React, {Component} from 'react';
import './style.sass';
import game from "../../scripts/game";
import DevStatistics from "../../components/DevStatistics";
import ActionBar from "../../components/ActionBar";

interface ComponentProps {
    toggleManual?: () => void
    runCode?: () => void
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
            <ActionBar onRunClick={this.props.runCode}
                       onHelpClick={this.props.toggleManual}/>
            <DevStatistics/>
        </div>;
    }
}
