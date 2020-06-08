// import React, { useState, createContext, useEffect } from "react";
import * as React from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { API_KEY } from "./config";
import axios from "axios";

interface ContextProps {
  loader: boolean;
  error: any;
  nextPageToken: string;
  hospitalData: any;
  showLoader: (action: boolean) => void;
  radius: number;
  setGeoRadius?: (value: number) => void;
  findHospital?: (lat: number, lng: number) => void;
  setAddressState?: (newAddress: string) => void;
  geocodeAddress?: () => void;
}

const locationContext = React.createContext<Partial<ContextProps>>({});

type Props = {
  children: React.ReactNode;
};

type Coords = {
  lat: number;
  lng: number;
};

type Location = {
  location?: Coords | null;
};

interface HospitalData {
  id: string;
  rating: number | null;
  icon?: string;
  vicinity: string | any;
  business_status: string;
  geometry: Location;
}

const LocationProvider = ({ children }: Props) => {
  const [coordinates, setCoordinates] = React.useState<Coords>({
    lat: 0,
    lng: 0,
  });
  const [address, setAddress] = React.useState<string>("");
  const [radius, setRadius] = React.useState<number>(10 * 1000);
  const [hospitalData, setHospitalData] = React.useState<HospitalData[]>([]);
  const [nextPageToken, setNextPageToken] = React.useState<string>("");
  const [loader, setLoader] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any | null>(null);

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
    showLoader(true);
    setHospitalData([]);
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
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
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&keyword=hospital&key=${API_KEY}`,
          {
            headers: {
              origin: null,
            },
          }
        );
        // console.log(hospitals);
        if (data.status === "OK") {
          // setAddressState("");
          showLoader(false);
          setHospitalData([...data.results]);
        }

        if (data.status === "OK" && data.next_page_token) {
          // setAddressState("");
          showLoader(false);
          setNextPageToken(data.next_page_token);
          setHospitalData([...data.results]);
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
