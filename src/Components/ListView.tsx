import React, { useContext, FunctionComponent } from "react";
import { List, Space } from "antd";
import { StarOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import locationContext from "../Context/location/Context";
// const hospitalData = hospitals.results;

type ICON = {
  icon: any | null;
  text: string | null;
};

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const IconText: FunctionComponent<ICON> = ({ icon, text }): JSX.Element => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ListView: FunctionComponent = () => {
  const context = useContext(locationContext);
  const { hospitalData, loader, error } = context;

  const data = hospitalData;

  const spinnerStyles = {
    display: "flex",
    justifyContent: "center",
    height: "calc(100vh - 70px)",
    alignItems: "center",
  };

  if (loader) {
    return (
      <div style={spinnerStyles}>
        <Spin indicator={antIcon} />
      </div>
    );
  }

  if (error) {
    return <p style={{ textAlign: "center" }}>{error}</p>;
  }

  return (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        // loading="true"
        dataSource={data}
        renderItem={(hospital) => (
          <List.Item
            className="hospital__list-item"
            key={hospital.id}
            actions={[
              <IconText
                icon={StarOutlined}
                text={`${hospital.rating}`}
                key="list-vertical-star-o"
              />,
            ]}
            extra={
              <img
                width={100}
                alt={`${hospital.name}`}
                src={`${hospital.icon}`}
              />
            }
          >
            <h2>{hospital.name}</h2>
            <p>Address: {hospital.vicinity}</p>
            <p>Status: {hospital.business_status}</p>
            <p>
              <span>Latitude: {hospital.geometry.location.lat}</span> ||{" "}
              <span>Latitude: {hospital.geometry.location.lng}</span>
            </p>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListView;
