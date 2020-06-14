import React, { FunctionComponent } from "react";
import Main from "./Main";
import { Switch, Route } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import Navigation from "./Navigation";
import Home from "./Home";
import AuthRoute from "./AuthRoute";

import "antd/dist/antd.css";
import "./style.css";

const style: React.CSSProperties = { height: "100vh" };

const App: FunctionComponent = () => {
  return (
    <div style={style}>
      <Navigation />
      <Switch>
        <Route exact path="/" component={Signin} />
        <AuthRoute exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        {/* <AuthRoute exact path="/main" component={Main} /> */}
        <Route exact path="/main" component={Main} />
      </Switch>
    </div>
  );
};

export default App;
