import React, {Component} from 'react';

interface ComponentProps {
    onRunClick?: () => void
}

interface ComponentState {
}

export default class ActionBar extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};

        this.onHelpClick = this.onHelpClick.bind(this);
    }

    onHelpClick() {
        alert("Ctrl-Shift-B for auto-formatting.");
    }

    render() {
        return <div className={"ActionBar"}>
            <button onClick={this.props.onRunClick}>Run</button>
            <button onClick={this.onHelpClick}>Help</button>
        </div>;
    }
}
