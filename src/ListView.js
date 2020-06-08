import React, { useContext } from "react";
import { List, Space } from "antd";
import { StarOutlined } from "@ant-design/icons";
import * as hospitals from "./hospitals.json";
import { Spin, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import locationContext from "./Context";
// const hospitalData = hospitals.results;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ListView = () => {
  const context = useContext(locationContext);
  const { hospitalData, loader, nextPageToken, error } = context;

  if (loader) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Spin indicator={antIcon} />
      </div>
    );
  }

  if (error) {
    return <p style={{ textAlign: "center" }}>{error}</p>;
  }

  return (
    <>
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
        dataSource={hospitalData}
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
//       {nextPageToken ? (
//         <div style={{ justifyContent: "center" }}>
//           <Button type="primary">Load More</Button>
//         </div>
//       ) : null}
    </>
  );
};

export default ListView;
