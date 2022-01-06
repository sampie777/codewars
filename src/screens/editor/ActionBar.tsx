import React, {Component} from 'react';

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
            <button onClick={this.props.onRunClick}>Run</button>
            <button onClick={this.props.onHelpClick}>Help</button>
        </div>;
    }
}
