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
    }

    getText() {
        return this.textAreaRef.current?.editor.getValue() || "";
    }

    render() {
        return <div className={"TextEditor"}>
            <AceEditor
                ref={this.textAreaRef}
                mode="javascript"
                theme="monokai"
                name="AceEditor"
                width="100%"
                height="529px"
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                defaultValue={this.getInitialCode()}
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

    private getInitialCode() {
        return `class Tank {
    constructor() {
        // These values must be updated by you, which will be sent to the server
        this.acceleration = 0;
        this.rotation = 0;
        
        // These values will be updated by the server
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.heading = 0;
    }

    clone(previousObj) {
        console.log("Cloning");
        this.acceleration = previousObj.acceleration;
    }

    render() {
        console.log("Render");
    }

    step(step) {
        console.log("Step ", step);
    }
}`;
    }
}
