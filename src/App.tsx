import React, { FunctionComponent } from "react";
import Main from "./Main";
import "antd/dist/antd.css";
import "./style.css";

const style: React.CSSProperties = { height: "100vh" };

const App: FunctionComponent = () => {
  return (
    <div style={style}>
      <Main />
    </div>
  );
};

export default App;
