import React, {Component} from 'react';
import "./style.sass"
import Content from "./Content";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark} from "@fortawesome/free-solid-svg-icons";

interface ComponentProps {
    show: boolean
    onClose?: () => void
}

interface ComponentState {
}

export default class ManualPopup extends Component<ComponentProps, ComponentState> {

    private originalWindowKeyDownListener: any = undefined;
    private originalWindowKeyUpListener: any = undefined;
    private originalWindowKeyPressListener: any = undefined;
    private readonly backgroundRef: React.RefObject<HTMLDivElement>;

    constructor(props: ComponentProps) {
        super(props);

        this.backgroundRef = React.createRef();

        this.state = {};

        this.addOnKeyPressListener = this.addOnKeyPressListener.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onBackgroundClick = this.onBackgroundClick.bind(this);
    }

    componentDidMount() {
        if (this.props.show) {
            this.addOnKeyPressListener()
        }
    }

    componentDidUpdate(prevProps: Readonly<ComponentProps>, prevState: Readonly<ComponentState>, snapshot?: any) {
        if (prevProps.show !== this.props.show) {
            if (this.props.show) {
                this.addOnKeyPressListener()
            } else {
                window.onkeydown = this.originalWindowKeyDownListener;
                window.onkeyup = this.originalWindowKeyUpListener;
                window.onkeypress = this.originalWindowKeyPressListener;
            }
        }
    }

    addOnKeyPressListener() {
        // Backup current listeners
        if (window.onkeydown !== null) {
            this.originalWindowKeyDownListener = window.onkeydown;
        }
        if (window.onkeyup !== this.onKeyPress) {
            this.originalWindowKeyUpListener = window.onkeyup;
        }
        if (window.onkeypress !== null) {
            this.originalWindowKeyPressListener = window.onkeypress;
        }

        window.onkeydown = null;
        window.onkeyup = this.onKeyPress;
        window.onkeypress = null;
    }

    onKeyPress(e: KeyboardEvent) {
        if (e.key === "Escape") {
            this.props.onClose?.();
        }
    }

    onBackgroundClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === this.backgroundRef.current) {
            this.props.onClose?.();
        }
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        return <div className={"ManualPopup"}
                    ref={this.backgroundRef}
                    onClick={this.onBackgroundClick}>
            <div className={"component"}>
                <div className={"titlebar"}>
                    <div className={"title"}>Manual</div>
                    <button className={"closebutton"}
                            onClick={this.props.onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <Content />
            </div>
        </div>;
    }
}
