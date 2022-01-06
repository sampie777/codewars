import React, {Component} from 'react';
import AceEditor from "react-ace";

interface ComponentProps {
    value: string
    height?: string
}

interface ComponentState {
}

export default class ReadOnlyEditor extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    render() {
        let height = this.props.height || "auto";
        if (height === "auto") {
            height = Math.ceil(this.props.value.split("\n").length * 16.25) + "px";
        }

        return <AceEditor
            mode="javascript"
            theme="monokai"
            name="AceEditor"
            width="100%"
            height={height}
            fontSize={14}
            showGutter={true}
            value={this.props.value}
            readOnly={true}
            setOptions={{
                showLineNumbers: true,
                tabSize: 4,
                useWorker: false,
            }}
        />;
    }
}
