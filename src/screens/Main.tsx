import React, {Component} from 'react';
import PageTitle from "../components/PageTitle";
import EditorComponent from "./editor/EditorComponent";
import DevStatistics from "../components/DevStatistics";

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
        return <div className={"Main"}>
            <PageTitle />

            <DevStatistics />

            <EditorComponent />
        </div>;
    }
}
