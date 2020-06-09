import React, { FunctionComponent } from "react";
import { LoadScript } from "@react-google-maps/api";
import SearchBox from "./SearcBox";
import ListView from "./ListView";
import MapView from "./MapView";
import { LocationProvider } from "./Context";
import { API_KEY } from "./config";
import { Tabs } from "antd";
import { Layout } from "antd";

const { Footer, Sider, Content } = Layout;
const { TabPane } = Tabs;
const libraries = ["places"];

const Main: FunctionComponent = () => {
  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <LocationProvider>
        <Layout style={{ height: "100vh" }}>
          <Sider
            width={350}
            breakpoint="md"
            collapsible={true}
            collapsedWidth={50}
            theme="dark"
          >
            <header
              style={{
                padding: "0 20px",
                paddingBottom: "10px",
                paddingTop: "5px",
              }}
            >
              <h2
                className="logo"
                style={{
                  color: "white",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                Hospitals Nearby.
              </h2>
            </header>
            <SearchBox />
          </Sider>

          <Layout>
            <Content style={{ padding: "0 30px", height: "100vh" }}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="ListView" key="1">
                  <ListView />
                </TabPane>

                <TabPane tab="MapView" key="2">
                  <MapView />
                </TabPane>
              </Tabs>
              <Footer
                style={{
                  position: "absolute",
                  bottom: "0px",
                  padding: "24px 0",
                }}
              >
                {" "}
                © {new Date().getFullYear()} Built by{" "}
                <a href="https://github.com/Young-Einstein10">
                  Young-Einstein10
                </a>
              </Footer>
            </Content>
          </Layout>
        </Layout>
      </LocationProvider>
    </LoadScript>
  );
};

export default Main;
