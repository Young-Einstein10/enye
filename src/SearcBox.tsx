import React, { useContext, FunctionComponent } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import locationContext from "./Context";
import ModalContext from "./ModalContext";
import usePlacesAutoComplete from "use-places-autocomplete";
import { AutoComplete } from "antd";
import { Select, Button, Modal, Table } from "antd";

const { Option } = AutoComplete;

const columns = [
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Radius",
    dataIndex: "radius",
    key: "radius",
  },
  {
    title: "Search Type",
    dataIndex: "searchType",
    key: "searchType",
  },
  {
    title: "Created On",
    dataIndex: "createdOn",
    key: "createdOn",
  },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: () => (
  //     <Space size="middle">
  //       <Button type="link" id>Delete</Button>
  //     </Space>
  //   ),
  // },
];

type Props = {
  style: React.CSSProperties;
};

const Search: FunctionComponent<Props> = (props) => {
  const context = useContext(locationContext);
  const {
    setGeoRadius,
    searchHistory,
    setType,
    setAddressState,
    showLoader,
    findHospital,
    setError,
    setLocationCoords,
    geocodeAddress,
  } = context;

  const modalContext = useContext(ModalContext);
  const { isVisible, closeModal, showModal } = modalContext;

  let tabkey = 1;
  const searchData = searchHistory?.map((search) => {
    const { address, createdOn, radius, searchType } = search;

    return {
      key: tabkey++,
      address,
      radius,
      searchType,
      createdOn: createdOn.toLocaleString(),
    };
  });

  const convertAddress = async (address: string) => {
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setLocationCoords(lat, lng);
      findHospital(lat, lng, address);
    } catch (error) {
      console.log(error);
      showLoader(false);
      setError(error.message);
    }
  };

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutoComplete();

  const handleRadiusChange = (value: number | any): void => setGeoRadius(value);

  const handleSearchType = (value: string) => {
    setType(value.toLowerCase());
  };

  return (
    <React.Fragment>
      <div className="searchBar" style={props.style}>
        <AutoComplete
          style={{
            width: 300,
            margin: "15px 0",
          }}
          value={value}
          onSelect={async (address) => {
            setValue(address, false);
            setAddressState(address);
            clearSuggestions();
          }}
          onChange={(e) => {
            // console.log(e);
            setValue(e);
            setAddressState(e);
          }}
          disabled={!ready}
          placeholder="Enter an Address"
        >
          {status === "OK" &&
            data.map(({ id, description }) => (
              <Option key={id} value={description}>
                {description}
              </Option>
            ))}
        </AutoComplete>
        <Select
          defaultValue="Select a geo-fencing radius"
          style={{ width: 300, margin: "15px 0" }}
          onChange={handleRadiusChange}
        >
          <Select.Option value={2}>2KM</Select.Option>
          <Select.Option value={3}>3KM</Select.Option>
          <Select.Option value={5}>5KM</Select.Option>
          <Select.Option value={8}>8KM</Select.Option>
          <Select.Option value={12}>12KM</Select.Option>
          <Select.Option value={15}>15KM</Select.Option>
          <Select.Option value={20}>20KM</Select.Option>
          <Select.Option value={30}>30KM</Select.Option>
          <Select.Option value={40}>40KM</Select.Option>
          <Select.Option value={50}>50KM</Select.Option>
        </Select>

        <Select
          style={{ width: 300, margin: "15px 0" }}
          placeholder="Select Search Optons"
          onChange={handleSearchType}
          optionLabelProp="label"
        >
          <Option value="Hospital" label="Hospital">
            <div className="demo-option-label-item">Hospitals</div>
          </Option>
          <Option value="Pharmacy" label="Pharmacy">
            <div className="demo-option-label-item">Pharmacy</div>
          </Option>
          <Option value="Clinic" label="Clinic">
            <div className="demo-option-label-item">Clinics</div>
          </Option>
          <Option value="Medical Offices" label="Medical Offices">
            <div className="demo-option-label-item">Medical Offices</div>
          </Option>
        </Select>

        <Button
          type="primary"
          size="middle"
          style={{ width: 300, marginTop: "10px" }}
          block
          onClick={() => {
            geocodeAddress();
          }}
        >
          Search
        </Button>

        <button
          style={{
            textDecoration: "underline",
            background: "none",
            border: "none",
            color: "white",
            paddingRight: "0",
            marginTop: "15px",
            cursor: "pointer",
          }}
          onClick={() => {
            showModal();
          }}
        >
          View Search History
        </button>

        <Modal
          title="Search History"
          visible={isVisible}
          width={600}
          onCancel={closeModal}
          onOk={closeModal}
        >
          <div>
            <Table
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    setAddressState(record.address);
                    closeModal();
                    showLoader(true);
                    setGeoRadius(record.radius / 1000);
                    setType(record.searchType);
                    convertAddress(record.address);
                    // console.log(record, rowIndex);
                  },
                };
              }}
              columns={columns}
              dataSource={searchData}
              size="small"
              pagination={{ pageSize: 50 }}
              scroll={{ y: 240 }}
            />
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default Search;
