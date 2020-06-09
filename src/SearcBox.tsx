import React, { useContext, FunctionComponent } from "react";
// USe-Paces-AUtocomplte
import locationContext from "./Context";
import usePlacesAutoComplete from "use-places-autocomplete";
import { AutoComplete } from "antd";
import { Select, Button } from "antd";

const { Option } = AutoComplete;

const Search: FunctionComponent = () => {
  const context = useContext(locationContext);
  const { setGeoRadius, setType, setAddressState, geocodeAddress } = context;

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutoComplete();

  const handleRadiusChange = (value: number | any): void => setGeoRadius(value);

  const handleKeywordChange = (value) => {
    console.log(value);
    setType(value);
  };

  return (
    <React.Fragment>
      <div className="searchBar" style={{ padding: "0 20px" }}>
        <AutoComplete
          style={{
            width: 300,
            marginBottom: "20px",
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
          style={{ width: 300, marginBottom: "20px" }}
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
          style={{ width: 300, marginBottom: "20px" }}
          placeholder="Select Search Optons"
          onChange={handleKeywordChange}
          optionLabelProp="label"
        >
          <Option value="hospital" label="hospital">
            <div className="demo-option-label-item">Hospitals</div>
          </Option>
          <Option value="pharmacy" label="pharmacy">
            <div className="demo-option-label-item">Pharmacies</div>
          </Option>
          <Option value="clinic" label="clinic">
            <div className="demo-option-label-item">Clinics</div>
          </Option>
          <Option value="medical offices" label="medical offices">
            <div className="demo-option-label-item">Medical Offices</div>
          </Option>
        </Select>

        <Button
          type="primary"
          size="middle"
          style={{ width: 300 }}
          block
          onClick={() => {
            geocodeAddress();
          }}
        >
          Search
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Search;
