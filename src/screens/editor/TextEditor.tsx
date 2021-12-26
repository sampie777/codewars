import React, {Component} from 'react';

interface ComponentProps {
}

interface ComponentState {
}

export default class TextEditor extends Component<ComponentProps, ComponentState> {

    private readonly textAreaRef: React.RefObject<HTMLTextAreaElement>;

    constructor(props: ComponentProps) {
        super(props);

        this.textAreaRef = React.createRef();

        this.state = {};
    }

    getText(){
        return this.textAreaRef.current?.value || "";
    }

    render() {
        return <div className={"TextEditor"}>
            <textarea ref={this.textAreaRef} defaultValue={`
            class Tank {
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
}`}/>
        </div>;
    }
}
