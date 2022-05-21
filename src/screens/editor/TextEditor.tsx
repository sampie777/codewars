import React, {Component} from 'react';
import "ace-builds";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-spellcheck";
import "ace-builds/src-noconflict/ext-error_marker";
import Beautify from 'ace-builds/src-noconflict/ext-beautify';
// @ts-ignore
import defaultTankTemplate from '../../scripts/player/defaultTankTemplate.txt';
// @ts-ignore
import emptyTankTemplate from '../../scripts/player/emptyTankTemplate.txt';

interface ComponentProps {
}

interface ComponentState {
}

export default class TextEditor extends Component<ComponentProps, ComponentState> {

    private readonly textAreaRef: React.RefObject<AceEditor>;

    constructor(props: ComponentProps) {
        super(props);

        this.textAreaRef = React.createRef();

        this.state = {};

        this.setNewCode = this.setNewCode.bind(this);
        this.setDefaultCode = this.setDefaultCode.bind(this);
    }

    componentDidMount() {
        this.setDefaultCode();
    }

    getText() {
        return this.textAreaRef.current?.editor.getValue() || "";
    }

    setNewCode() {
        fetch(emptyTankTemplate)
            .then(r => r.text())
            .then(text => {
                this.textAreaRef.current?.editor.setValue(text);
                this.textAreaRef.current?.editor.clearSelection();
            });
    }

    setDefaultCode() {
        fetch(defaultTankTemplate)
            .then(r => r.text())
            .then(text => {
                this.textAreaRef.current?.editor.setValue(text);
                this.textAreaRef.current?.editor.clearSelection();
            });
    }

    private cancelKeyEventsPropagation(e: React.KeyboardEvent) {
        e.stopPropagation();
    }

    render() {
        return <div className={"TextEditor"}
                    onKeyUp={this.cancelKeyEventsPropagation}
                    onKeyDown={this.cancelKeyEventsPropagation}
                    onKeyPress={this.cancelKeyEventsPropagation}>
            <AceEditor
                ref={this.textAreaRef}
                mode="javascript"
                theme="monokai"
                name="AceEditor"
                width="100%"
                height="100%"
                fontSize={14}
                showPrintMargin={false}
                defaultValue={""}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 4,
                    // useWorker: false,
                    spellcheck: true,
                }}
                commands={Beautify.commands}
            />
        </div>;
    }
}
