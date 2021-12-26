import React, {Component} from 'react';

interface ComponentProps {
}

interface ComponentState {
}

export default class PageTitle extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {};
    }

    render() {
        return <h3 className={"PageTitle"}>
            Code Wars
        </h3>;
    }
}
