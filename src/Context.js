import React, { useState, createContext } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { API_KEY } from "./config";
const locationContext = createContext();

const LocationProvider = ({ children }) => {
  const [coordinates, setCoordinates] = useState({
    lat: "",
    lng: "",
  });
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(10 * 1000);
  const [hospitalData, setHospitalData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const setAddressState = (newAddress) => {
    setAddress(newAddress);
  };

  const setGeoRadius = (value) => {
    setRadius(value * 1000);
  };

  const showLoader = (action) => {
    if (action === true) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  };

  const geocodeAddress = async () => {
    setHospitalData([]);
    showLoader(true);
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log(results);
      console.log(lat, lng);
      // Set Lat and Lng Context
      setCoordinates({ ...coordinates, lat, lng });
      findHospital(lat, lng);
    } catch (error) {
      console.log(error);
      showLoader(false);
      setError(error.message);
    }
  };

  // Function to find nearby hospitals
  const findHospital = async (lat, lng) => {
    try {
      if (lat && lng) {
        const response = await fetch(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&keyword=hospital&key=${API_KEY}`, {
            headers: {
              origin: null,
            },
          }
        );
        const hospitals = await response.json();
        console.log(hospitals);
        if (hospitals.status === "OK") {
          // setAddressState("");
          showLoader(false);
          setHospitalData([...hospitalData, ...hospitals.results]);
        }

        if (hospitals.status === "OK" && hospitals.next_page_token) {
          // setAddressState("");
          showLoader(false);
          setNextPageToken(hospitals.next_page_token);
        }
      } else {
        console.log("Coordinates Not Present");
        showLoader(false);
        setError("Pls Enter an Address to get coordinates!");
      }
    } catch (error) {
      console.log(error);
      showLoader(false);
      setError(error.message);
    }
  };

  const getNextPage = () => {};

  return (
    <locationContext.Provider
      value={{
        loader,
        error,
        nextPageToken,
        hospitalData,
        showLoader,
        radius,
        setGeoRadius,
        findHospital,
        setAddressState,
        geocodeAddress,
      }}
    >
      {children}
    </locationContext.Provider>
  );
};

export default locationContext;

export { LocationProvider };
