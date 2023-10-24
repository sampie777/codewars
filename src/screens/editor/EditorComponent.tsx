import React, {Component} from 'react';
import TextEditor from "./TextEditor";
import './style.sass';
import CompileError from "./CompileError";

interface ComponentProps {
    toggleManual?: () => void
    textEditorRef: React.RefObject<TextEditor>
    compileError?: string
}

interface ComponentState {
}

export default class EditorComponent extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    render() {
        return <div className={"EditorComponent"}>
            {this.props.compileError === undefined ? undefined :
                <CompileError error={this.props.compileError} />}

            <TextEditor ref={this.props.textEditorRef}/>
        </div>;
    }
}
