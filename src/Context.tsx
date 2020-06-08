// import React, { useState, createContext, useEffect } from "react";
import * as React from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { API_KEY } from "./config";
import axios from "axios";

type ContextProps = {
  loader: boolean;
  error: any;
  nextPageToken: string;
  hospitalData: any;
  showLoader: any;
  radius: number;
  setGeoRadius: any;
  findHospital: any;
  setAddressState: any;
  geocodeAddress: any;
};

const locationContext = React.createContext<Partial<ContextProps>>({});

type Props = {
  children: React.ReactNode;
};

const LocationProvider = ({ children }: Props) => {
  const [coordinates, setCoordinates] = React.useState({
    lat: 0,
    lng: 0,
  });
  const [address, setAddress] = React.useState<string>("");
  const [radius, setRadius] = React.useState(10 * 1000);
  const [hospitalData, setHospitalData] = React.useState<any>([]);
  const [nextPageToken, setNextPageToken] = React.useState<string>("");
  const [loader, setLoader] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    axios.defaults.baseURL = "https://maps.googleapis.com/maps/api";
  }, []);

  const setAddressState = (newAddress: string) => {
    setAddress(newAddress);
  };

  const setGeoRadius = (value: number) => {
    setRadius(value * 1000);
  };

  const showLoader = (action: boolean) => {
    if (action === true) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  };

  const geocodeAddress = async () => {
    setHospitalData([]);
    showLoader(true);
    // Clear Hospital Data
    // if (hospitalData.length !== 0) {
    //   console.log("prev State");
    //   setHospitalData((prevState) => [...initState]);
    // }
    setHospitalData([]);
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      // console.log(results);
      // console.log(lat, lng);
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
  const findHospital = async (lat: number, lng: number) => {
    try {
      if (lat && lng) {
        const { data } = await axios.get(
          `/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&keyword=hospital&key=${API_KEY}`
        );
        // console.log(hospitals);
        if (data.status === "OK") {
          // setAddressState("");
          showLoader(false);
          setHospitalData([...hospitalData, ...data.results]);
        }

        if (data.status === "OK" && data.next_page_token) {
          // setAddressState("");
          showLoader(false);
          setNextPageToken(data.next_page_token);
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
