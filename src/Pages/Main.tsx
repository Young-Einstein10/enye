import React, { FunctionComponent } from "react";
import { LoadScript } from "@react-google-maps/api";
import SearchBox from "../Components/SearcBox";
import ListView from "../Components/ListView";
import MapView from "../Components/MapView";
import { LocationProvider } from "../Context/location/Context";
import { ModalProvider } from "../Context/modal/ModalContext";
import { API_KEY } from "../utils/config";
import { Tabs, Typography, Layout } from "antd";

const { Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
const libraries = ["places"];

const Main: FunctionComponent = () => {
  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <LocationProvider>
        <ModalProvider>
          <Layout style={{ height: "calc(100vh - 60px)" }}>
            <Sider
              width={350}
              breakpoint="md"
              collapsedWidth="0"
              theme="dark"
              className="hide-sidenav"
              style={{ background: "#0e153a" }}
            >
              <header
                style={{
                  padding: "0 20px",
                  paddingBottom: "10px",
                  paddingTop: "5px",
                  borderBottom: "solid 1px white",
                  display: "none",
                }}
              >
                <Title
                  level={2}
                  className="logo"
                  style={{
                    color: "white",
                  }}
                >
                  Hospitals Nearby.
                </Title>
              </header>
              <SearchBox style={{ padding: "0 20px", marginTop: "50px" }} />
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
        </ModalProvider>
      </LocationProvider>
    </LoadScript>
  );
};

export default Main;
