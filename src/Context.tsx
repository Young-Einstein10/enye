// import React, { useState, createContext, useEffect } from "react";
import * as React from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { API_KEY } from "./config";
import { firestore } from "./Firebase";
import axios from "axios";

interface ContextProps {
  loader: boolean;
  error: any;
  // nextPageToken: string;
  hospitalData: HospitalData[];
  searchHistory: SearchHistory[];
  showLoader: (action: boolean) => void;
  radius: number;
  setGeoRadius?: (value: number) => void;
  setError?: any;
  setLocationCoords: (lat: number, lng: number) => void;
  setType: (value: string) => void;
  findHospital: (lat: number, lng: number) => void;
  setAddressState?: (newAddress: string) => void;
  geocodeAddress?: () => void;
}

const locationContext = React.createContext<Partial<ContextProps>>({});

const proxy_url: string = "https://cors-anywhere.herokuapp.com";

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
  name: string;
  icon?: string;
  vicinity: string | any;
  business_status: string;
  geometry: Location;
}

interface SearchHistory {
  id: string;
  address: string;
  req_url: string;
  searchType: string;
  radius: number;
  createdOn: Date;
}

const LocationProvider: React.FunctionComponent = ({ children }: Props) => {
  const [coordinates, setCoordinates] = React.useState<Coords>({
    lat: 0,
    lng: 0,
  });
  const [address, setAddress] = React.useState<string>("");
  const [radius, setRadius] = React.useState<number>(1500);
  const [searchType, setSearchType] = React.useState<string>("hospital");
  const [hospitalData, setHospitalData] = React.useState<HospitalData[]>([]);
  const [searchHistory, setSearchHistory] = React.useState<SearchHistory[]>([]);
  // const [nextPageToken, setNextPageToken] = React.useState<string>("");
  const [loader, setLoader] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any | null>(null);

  React.useEffect(() => {
    let isCancelled = false;
    const getSearchFromDB = async () => {
      if (!isCancelled) {
        firestore.collection("searches").onSnapshot((snapshot) => {
          let pastSearches = [];
          snapshot.docChanges().forEach((element) => {
            if (element.type === "added") {
              pastSearches.push({
                id: element.doc.id,
                ...element.doc.data(),
                createdOn: element.doc.data().createdOn.toDate(),
              });
            }
          });

          setSearchHistory((prevState) => [...prevState, ...pastSearches]);
        });
      }
    };

    getSearchFromDB();
    return () => {
      isCancelled = true;
    };
  }, []);

  const setAddressState = (newAddress: string) => {
    setAddress(newAddress);
  };

  const setLocationCoords = (lat: number, lng: number) => {
    setCoordinates({ ...coordinates, lat, lng });
  };

  const setGeoRadius = (value: number) => {
    setRadius(value * 1000);
  };

  const setType = (value: string) => {
    setSearchType(value);
  };

  const formatType = (str: string): string => str.split(" ").join("%20");

  const showLoader = (action: boolean) => {
    if (action === true) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  };

  const geocodeAddress = async () => {
    showLoader(true);
    if (address.length === 0) {
      setError("Please Enter an Address");
    }
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
        const req_url: string = `${proxy_url}/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${formatType(
          searchType
        )}&keyword=${formatType(searchType)}&key=${API_KEY}`;
        const { data } = await axios.get(req_url, {
          headers: {
            origin: null,
          },
        });
        // console.log(hospitals);
        if (data.status === "OK") {
          // setAddressState("");
          showLoader(false);
          setHospitalData([...data.results]);
          let newSearch = {
            address,
            searchType,
            radius,
            createdOn: new Date(),
          };
          addSearchToDB(newSearch);
        }

        // if (data.status === "OK" && data.next_page_token) {
        //   // setAddressState("");
        //   showLoader(false);
        //   setNextPageToken(data.next_page_token);
        //   setHospitalData([...data.results]);
        //   let newSearch = {
        //     address,
        //     searchType,
        //     radius,
        //     createdOn: new Date(),
        //   };
        //   addSearchToDB(newSearch);
        // }

        if (data.status === "ZERO_RESULTS") {
          // setAddressState("");
          showLoader(false);
          setHospitalData([]);
          setError("No Data Found!");
        }

        if (data.status === "OVER_QUERY_LIMIT") {
          // setAddressState("");
          showLoader(false);
          setHospitalData([]);
          setError("API Quota Reached!");
        }

        if (data.status === "REQUEST_DENIED") {
          // setAddressState("");
          showLoader(false);
          setHospitalData([]);
          setError("API key Invalid!");
        }

        if (data.status === "UNKNOWN_ERROR") {
          // setAddressState("");
          showLoader(false);
          setHospitalData([]);
          setError("Error from Server, Pls try again later!");
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

  const addSearchToDB = async (search) => {
    try {
      const docRef = await firestore.collection("searches").add(search);
      const doc = await docRef.id;
      // console.log(doc);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <locationContext.Provider
      value={{
        loader,
        error,
        // nextPageToken,
        hospitalData,
        searchHistory,
        showLoader,
        radius,
        setGeoRadius,
        findHospital,
        setLocationCoords,
        setError,
        setType,
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
