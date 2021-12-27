import React, {Component} from 'react';
import PageTitle from "../components/PageTitle";
import EditorComponent from "./editor/EditorComponent";
import DevStatistics from "../components/DevStatistics";
import './style.sass';
import GameField from "./gamefield/GameField";

interface ComponentProps {
}

interface ComponentState {
}

export default class Main extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    render() {
        return <div className={"Main wrapper"}>
            <PageTitle/>

            <DevStatistics/>

            <div className={"content"}>
                <GameField />
                <EditorComponent/>
            </div>
        </div>;
    }
}
