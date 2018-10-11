/*
 * @Author: DFC
 * @Date: 2018-05-20 15:54:54
 * @Last Modified by: dfc
 * @Last Modified time: 2018-10-11 18:48:57
 */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import App from "./page/App";
import configureStore from "./store/store";
import "./asserts/css/index.scss";
const store = configureStore();
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById("app")
);
