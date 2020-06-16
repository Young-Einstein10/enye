import React, { FunctionComponent } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Main from "./Main";
import { Switch, Route } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import Navigation from "./Navigation";
import AuthRoute from "./AuthRoute";

import "antd/dist/antd.css";
import "./style.css";

const style: React.CSSProperties = { height: "100vh" };

// apollo client setup
const client = new ApolloClient({
  uri: "https://us-central1-enye-d35c3.cloudfunctions.net/api/graphql",
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
