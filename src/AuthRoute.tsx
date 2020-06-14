import React, { useContext, ReactNode } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { UserContext } from "./Context/UserContext";

type Props = {
  component: React.ComponentType<RouteProps>;
};

// const AuthRoute: React.SFC<RouteProps> = ({ component: Component, ...rest }: Props) => {
//   const context = useContext(UserContext);

//   const {
//     userState: { loaded },
//   } = context;
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         loaded === true ? <Component {...props} /> : <Redirect to="/signin" />
//       }
//     />
//   );
// };

const AuthRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const context = useContext(UserContext);

  const {
    userState: { loaded },
  } = context;
  const routeComponent = (props: any) =>
    loaded ? (
      <Redirect to={{ pathname: "/main" }} />
    ) : (
      React.createElement(component, props)
    );
  return <Route {...rest} render={routeComponent} />;
};

export default AuthRoute;
