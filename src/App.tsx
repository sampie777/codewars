import React, {Component} from 'react';
import Main from "./screens/Main";
import './App.sass';
import game from "./scripts/game";

interface ComponentProps {
}

interface ComponentState {
}

export default class App extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        // Start the game with a small timeout to let the page initialize first
        setTimeout(() => game.start(), 100);
    }

    render() {
        return <div className={"App"}>
            <Main/>
        </div>;
    }
}
