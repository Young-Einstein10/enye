import React from "react";
import { LoadScript } from "@react-google-maps/api";
import SearchBox from "./SearcBox";
import ListView from "./ListView";
import MapView from "./MapView";
import { LocationProvider } from "./Context";
import { API_KEY } from "./config";
import { Tabs } from "antd";
import { Layout } from "antd";

const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;
const libraries = ["places"];

const Main = () => {
  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <LocationProvider>
        <Layout>
          <Header
            className="search-header"
            style={{ padding: "15px inherit", height: "200px" }}
          >
            <SearchBox />
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <Tabs
              defaultActiveKey="1"
              style={{ justifyContent: "center" }}
              // onChange={callback}
            >
              <TabPane tab="Tab 1" key="1">
                {/* List View */}
                <ListView />
              </TabPane>

              <TabPane tab="Tab 2" key="2">
                {/* Map View */}
                <MapView />
              </TabPane>
            </Tabs>
          </Content>
          <Footer>
            {" "}
            © {new Date().getFullYear()} Built by{" "}
            <a href="https://github.com/Young-Einstein10">Young-Einstein10</a>
          </Footer>
        </Layout>
      </LocationProvider>
    </LoadScript>
  );
};

export default Main;
