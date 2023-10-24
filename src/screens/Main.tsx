import React, {Component} from 'react';
import PageTitle from "../components/PageTitle";
import EditorComponent from "./editor/EditorComponent";
import './style.sass';
import GameField from "./gamefield/GameField";
import ManualPopup from "./manual/ManualPopup";
import {runUserCode} from "../scripts/editor";
import TextEditor from "./editor/TextEditor";

interface ComponentProps {
}

interface ComponentState {
    showManual: boolean
    compileError?: string
}

export default class Main extends Component<ComponentProps, ComponentState> {

    private readonly textEditorRef: React.RefObject<TextEditor>;

    constructor(props: ComponentProps) {
        super(props);

        this.textEditorRef = React.createRef();

        this.state = {
            showManual: false
        };

        this.showManual = this.showManual.bind(this);
        this.closeManual = this.closeManual.bind(this);
        this.runCode = this.runCode.bind(this);
        this.showError = this.showError.bind(this);
        this.onNewCodeClick = this.onNewCodeClick.bind(this);
        this.onDefaultCodeClick = this.onDefaultCodeClick.bind(this);
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

    runCode() {
        const text = this.textEditorRef.current?.getText() || "";
        const error = runUserCode(text);
        this.showError(error);
    }

    showError(text: string | undefined) {
        this.setState({
            compileError: text
        });
    }

    onNewCodeClick() {
        this.textEditorRef.current?.setNewCode();
    }

    onDefaultCodeClick() {
        this.textEditorRef.current?.setDefaultCode();
    }

    render() {
        return <div className={"Main wrapper"}>
            <PageTitle/>

            <div className={"content"}>
                <EditorComponent toggleManual={this.showManual}
                                 textEditorRef={this.textEditorRef}
                                 compileError={this.state.compileError}/>
                <GameField runCode={this.runCode}
                           toggleManual={this.showManual}
                           onNewCodeClick={this.onNewCodeClick}
                           onDefaultCodeClick={this.onDefaultCodeClick}/>
            </div>

            <ManualPopup show={this.state.showManual}
                         onClose={this.closeManual}/>
        </div>;
    }
}
