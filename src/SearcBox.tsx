import React, { useState, useContext } from "react";
// USe-Paces-AUtocomplte
import usePlacesAutoComplete from "use-places-autocomplete";
import { Select } from "antd";

import locationContext from "./Context";

import { AutoComplete } from "antd";

const { Option } = AutoComplete;

const Search = () => {
  // Radius in KM
  // const [radiusVal, setRadiusVal] = useState(10);

  const context = useContext(locationContext);
  const { setGeoRadius, setAddressState, geocodeAddress } = context;

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutoComplete();

  function handleChange(value) {
    console.log(`selected ${value}`);
    setGeoRadius(value);
  }

  return (
    <>
      <div className="searchBar">
        <AutoComplete
          style={{
            width: 300,
            color: "black",
          }}
          // onSearch={handleSearch}
          value={value}
          onSelect={async (address) => {
            // console.log(address);
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
          placeholder="Enter Address"
        >
          {status === "OK" &&
            data.map(({ id, description }) => (
              <Option key={id} value={description}>
                {description}
              </Option>
            ))}
        </AutoComplete>

        <div className="radius-options">
          <Select
            defaultValue="Select a geo-fencing radius"
            style={{ width: 300 }}
            onChange={handleChange}
          >
            <Select.Option value={10}>10KM</Select.Option>
            <Select.Option value={20}>20KM</Select.Option>
            <Select.Option value={30}>30KM</Select.Option>
            <Select.Option value={40}>40KM</Select.Option>
            <Select.Option value={50}>50KM</Select.Option>
          </Select>
        </div>

        <button
          onClick={() => {
            geocodeAddress();
          }}
          className="search-hospital-btn"
        >
          Search
        </button>
      </div>
    </>
  );
};

export default Search;
