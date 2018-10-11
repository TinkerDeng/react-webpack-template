import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import PropTypes from "prop-types";

import * as LoadingActions from "src/store/actions/loading";

const mapStateToProps = (state, ownProps) => {
    return {
        loading: state.loading.loading
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadingActions: bindActionCreators(LoadingActions, dispatch),
        dispatch
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    submit() {
        const {loading, loadingActions} = this.props;
        if (loading) {
            loadingActions.hide();
        } else {
            loadingActions.show();
        }
    }

    render() {
        const {loading} = this.props;
        console.log(this);
        console.log(1111);
        return (
            <div>
                {
                    loading ? <div className="true">显示 </div> : <div className="false">隐藏</div>
                }
                <button onClick={this.submit.bind(this)}>按钮</button>
            </div>
        );
    }
}