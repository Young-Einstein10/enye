import React, { FunctionComponent } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Main from "./Pages/Main";
import { Switch, Route } from "react-router-dom";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Navigation from "./Components/Navigation";
import AuthRoute from "./utils/AuthRoute";

import "antd/dist/antd.css";
import "./style.css";

const style: React.CSSProperties = { height: "100vh" };

// apollo client setup
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
});

const App: FunctionComponent = () => {
  return (
    <ApolloProvider client={client}>
      <div style={style}>
        <Navigation />
        <Switch>
          <Route exact path="/" component={Signin} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <AuthRoute exact path="/main" component={Main} />
        </Switch>
      </div>
    </ApolloProvider>
  );
};

export default App;
