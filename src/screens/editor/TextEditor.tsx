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
import defaultCodeFile from './defaultCode.txt';

interface ComponentProps {
}

interface ComponentState {
    defaultValue?: string
}

export default class TextEditor extends Component<ComponentProps, ComponentState> {

    private readonly textAreaRef: React.RefObject<AceEditor>;

    constructor(props: ComponentProps) {
        super(props);

        this.textAreaRef = React.createRef();

        this.state = {};
    }

    componentDidMount() {
        fetch(defaultCodeFile)
            .then(r => r.text())
            .then(text => {
                this.setState({
                    defaultValue: text
                })
            });
    }

    getText() {
        return this.textAreaRef.current?.editor.getValue() || "";
    }

    private cancelKeyEventsPropagation(e: React.KeyboardEvent) {
        e.stopPropagation();
    }

    render() {
        return <div className={"TextEditor"}
                    onKeyUp={this.cancelKeyEventsPropagation}
                    onKeyDown={this.cancelKeyEventsPropagation}
                    onKeyPress={this.cancelKeyEventsPropagation}
        >
            {this.state.defaultValue === undefined ? undefined :
                <AceEditor
                    ref={this.textAreaRef}
                    mode="javascript"
                    theme="monokai"
                    name="AceEditor"
                    width="100%"
                    height="629px"
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    defaultValue={this.state.defaultValue}
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
            }
        </div>;
    }
}
