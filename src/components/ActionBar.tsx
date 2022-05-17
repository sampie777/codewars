import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {faCircleQuestion} from "@fortawesome/free-regular-svg-icons";
import './ActionBar.sass';

interface ComponentProps {
    onRunClick?: () => void
    onHelpClick?: () => void
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
            <button onClick={this.props.onRunClick} className={"run"}>
                <FontAwesomeIcon icon={faPlay} fixedWidth/>
            </button>
            <button onClick={this.props.onHelpClick} className={"help"}>
                <FontAwesomeIcon icon={faCircleQuestion} fixedWidth/>
            </button>
        </div>;
    }
}
