import React, {Component} from 'react';
import Main from "./screens/Main";

interface ComponentProps {
}

interface ComponentState {
}

export default class App extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    render() {
        return <div className={"App"}>
            <Main />
        </div>;
    }
}
