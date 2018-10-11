import React from "react";
import { Route, NavLink, Switch, withRouter } from "react-router-dom";
import Home from "./Home/index";
import NotFound from "./NotFound/index";
import { hot } from "react-hot-loader";
import PropTypes from "prop-types";

@withRouter
class MyApp extends React.Component {
  static contextTypes = {
    store: PropTypes.object, //store放在了上下文对象context上面,子组件就可以从context拿到store
    router: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    console.log(this.props);
    return (
      <div className="common">
        <ul>
          <li>
            <NavLink to="/" activeClassName="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" activeClassName="active">
              About
            </NavLink>
          </li>
        </ul>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

let App = MyApp;
if (module.hot) {
  App = hot(module)(MyApp);
}
export default App;
