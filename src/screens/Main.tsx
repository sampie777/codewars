import React, {Component} from 'react';
import PageTitle from "../components/PageTitle";
import EditorComponent from "./editor/EditorComponent";
import DevStatistics from "../components/DevStatistics";
import './style.sass';
import GameField from "./gamefield/GameField";
import ManualPopup from "./manual/ManualPopup";

interface ComponentProps {
}

interface ComponentState {
    showManual: boolean
}

export default class Main extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {
            showManual: false
        };

        this.showManual = this.showManual.bind(this);
        this.closeManual = this.closeManual.bind(this);
    }

    showManual() {
        this.setState({
            showManual: true
        })
    }

    closeManual() {
        this.setState({
            showManual: false
        })
    }

    render() {
        return <div className={"Main wrapper"}>
            <PageTitle/>

            <DevStatistics/>

            <div className={"content"}>
                <GameField/>
                <EditorComponent toggleManual={this.showManual}/>
            </div>

            <ManualPopup show={this.state.showManual}
                         onClose={this.closeManual}/>
        </div>;
    }
}
