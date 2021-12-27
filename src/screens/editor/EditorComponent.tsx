import React, {Component} from 'react';
import TextEditor from "./TextEditor";
import ActionBar from "./ActionBar";
import {runUserCode} from "../../scripts/editor";
import './style.sass';

interface ComponentProps {
}

interface ComponentState {
    compileError?: string
}

export default class EditorComponent extends Component<ComponentProps, ComponentState> {

    private readonly textEditorRef: React.RefObject<TextEditor>;

    constructor(props: ComponentProps) {
        super(props);

        this.textEditorRef = React.createRef();

        this.state = {};

        this.onRunClick = this.onRunClick.bind(this);
        this.showError = this.showError.bind(this);
    }

    onRunClick() {
        const text = this.textEditorRef.current?.getText() || "";
        const error = runUserCode(text);
        this.showError(error);
    }

    showError(text: string | undefined) {
        this.setState({
            compileError: text
        });
    }

    render() {
        return <div className={"EditorComponent"}>
            <ActionBar onRunClick={this.onRunClick}/>

            {this.state.compileError === undefined ? undefined :
                <p>{this.state.compileError}</p>}

            <TextEditor ref={this.textEditorRef}/>
        </div>;
    }
}
