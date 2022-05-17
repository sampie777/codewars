import React, {Component} from 'react';
import './CompileError.sass';

interface ComponentProps {
    error?: string
}

interface ComponentState {
}

export default class CompileError extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    render() {
        return <div className={"CompileError"}>
            {this.props.error}
        </div>;
    }
}
