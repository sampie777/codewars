import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import {faRobot} from "@fortawesome/free-solid-svg-icons";
import './PageTitle.sass';

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
            <FontAwesomeIcon icon={faRobot} />&nbsp;
            Code Wars
        </h3>;
    }
}
