import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const AuthRoute = ({ component: Component, ...rest }: any) => {
  const context = useContext(UserContext);

  const {
    userState: { user },
  } = context;

  return (
    <Route
      {...rest}
      render={(props: any) =>
        !!user ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

export default AuthRoute;
