import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { signOut } from "../utils/Firebase";
import { Button } from "antd";
import { UserContext } from "../Context/auth";

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
        <Button type="primary" onClick={handleSignOut}>
          Sign Out
        </Button>
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
