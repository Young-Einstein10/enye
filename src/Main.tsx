import React, {
  FunctionComponent,
  useState,
} from "react";
import { LoadScript } from "@react-google-maps/api";
import SearchBox from "./SearcBox";
import ListView from "./ListView";
import MapView from "./MapView";
import { LocationProvider } from "./Context";
import { ModalProvider } from "./ModalContext";
import { API_KEY } from "./config";
import { Tabs, Typography, Layout, Drawer, Button } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";

const { Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
const libraries = ["places"];

const Main: FunctionComponent = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <LocationProvider>
        <ModalProvider>
          <Layout style={{ height: "calc(100vh - 60px)" }}>
            <Sider
              width={350}
              collapsible={true}
              collapsedWidth={50}
              theme="dark"
              className="hide-sidenav"
              style={{ background: "#0e153a" }}
              trigger={null}
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

            <>
              <Button className="menu-btn" type="primary" onClick={showDrawer}>
                <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
              </Button>
              <Drawer
                title="Hospitals Nearby."
                placement="left"
                closable={false}
                width={350}
                onClose={onClose}
                visible={visible}
                bodyStyle={{ background: "#0e153a" }}
              >
                <SearchBox style={{ padding: "0 0px", marginTop: "50px" }} />
              </Drawer>
            </>

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
