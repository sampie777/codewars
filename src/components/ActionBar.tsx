import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {faCircleQuestion, faFile, faFileLines} from "@fortawesome/free-regular-svg-icons";
import './ActionBar.sass';

interface ComponentProps {
    onRunClick?: () => void
    onHelpClick?: () => void
    onNewCodeClick?: () => void
    onDefaultCodeClick?: () => void
}

interface ComponentState {
}

export default class ActionBar extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    render() {
        return <div className={"ActionBar"}>
            <button onClick={this.props.onNewCodeClick}
                    title={"Start with a blank Tank template"}>
                <FontAwesomeIcon icon={faFile} fixedWidth/>
            </button>
            <button onClick={this.props.onDefaultCodeClick}
                    title={"Start with the default Tank template"}>
                <FontAwesomeIcon icon={faFileLines} fixedWidth/>
            </button>
            <button onClick={this.props.onRunClick}
                    className={"run"}
                    title={"Upload the new code to your tank"}>
                <FontAwesomeIcon icon={faPlay} fixedWidth/>
            </button>
            <button onClick={this.props.onHelpClick}
                    className={"help"}
                    title={"Open the game manual"}>
                <FontAwesomeIcon icon={faCircleQuestion} fixedWidth/>
            </button>
            <div className={"emptyButton"} />
        </div>;
    }
}
