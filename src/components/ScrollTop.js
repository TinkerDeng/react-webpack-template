import React from "react";
import {withRouter} from "react-router-dom";

class ScrollTop extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return (
            <div>
                aaa
            </div>
        );
    }
}

export default withRouter(ScrollTop);