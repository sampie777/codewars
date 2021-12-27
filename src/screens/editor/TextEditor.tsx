import React, {Component} from 'react';
import "ace-builds";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-spellcheck";
import "ace-builds/src-noconflict/ext-error_marker";

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
                defaultValue={`class Tank {
    acceleration = 0;

    clone(previousObj) {
        console.log("Clonging");
        this.acceleration = previousObj.acceleration;
    }

    render() {
        console.log("Render");
    }

    step(step) {
        console.log("Step ", step);
    }
}`}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                    // useWorker: false,
                    spellcheck: true,
                }}
            />
        </div>;
    }
}
