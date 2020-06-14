import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { signOut } from "./Firebase";
import { UserContext } from "./Context/UserContext";
// import Main from './Main'

const Navigation = () => {
  const context = useContext(UserContext);

  const {
    userState: { user },
  } = context;

  return <div>{user ? <SignedinNav /> : <SignedoutNav />}</div>;
};

const SignedinNav = () => {
  const context = useContext(UserContext);

  const { onLogout } = context;

  const handleSignOut = () => {
    signOut();
    onLogout();
  };

  return (
    <nav className="nav">
      <div className="logo">
        <h2>
          <Link to="/">Hospitals Nearby</Link>
        </h2>
      </div>

      <div className="nav-items">
        <Link to="/main">Dashboard</Link>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </nav>
  );
};

const SignedoutNav = () => {
  return (
    <nav className="nav">
      <div className="logo">
        <h2>
          <Link to="/">Hospitals Nearby</Link>
        </h2>
      </div>

      <div className="nav-items">
        <Link to="/signin">Sign In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navigation;
