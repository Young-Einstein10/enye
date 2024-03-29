import * as React from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { API_KEY } from "../../utils/config";
import { auth } from "../../utils/Firebase";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ADD_NEW_SEARCH, GetUserDetailsQuery } from "./queries";
import { ContextProps, Coords, HospitalData, SearchHistory } from "./types";

const locationContext = React.createContext<ContextProps>({
  loader: false,
  error: null,
  hospitalData: [],
  searchHistory: [],
  showLoader: (action: boolean) => {},
  searchLoader: false,
  radius: 1500,
  setGeoRadius: (value: number) => {},
  // setError: ,
  setLocationCoords: (lat: number, lng: number) => {},
  setType: (value: string) => {},
  findHospital: (lat: number, lng: number, address: string) => {},
  setAddressState: (newAddress: string) => {},
  geocodeAddress: () => {},
});

const BASE_URL = process.env.REACT_APP_BASE_URL;

// const isProd =
//   process.env.NODE_ENV === "production"
//     ? "https://maps.googleapis.com/"
//     : "/googleapi/";

const LocationProvider: React.FunctionComponent = ({ children }) => {
  const [coordinates, setCoordinates] = React.useState<Coords>({
    lat: 0,
    lng: 0,
  });
  const [address, setAddress] = React.useState<string>("");
  const [radius, setRadius] = React.useState<number>(1500);
  const [searchType, setSearchType] = React.useState<string>("hospital");
  const [hospitalData, setHospitalData] = React.useState<HospitalData[]>([]);
  const [searchHistory, setSearchHistory] = React.useState<SearchHistory[]>([]);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [searchLoader, setSearchLoader] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any | null>(null);

  const updateSearchHistory = (data: any) => {
    setSearchHistory((prevState) => [
      ...prevState,
      ...data.user[0].searchHistory,
    ]);
  };

  const [
    addNewSearch,
    { data: searchData, loading: mutationLoading, error: mutationError },
  ] = useMutation(ADD_NEW_SEARCH);

  const { loading, data: queryData } = useQuery(GetUserDetailsQuery, {
    variables: { id: auth?.currentUser?.uid },
  });

  React.useEffect(() => {
    if (searchData) {
      setSearchHistory((prevState) => [
        ...prevState,
        searchData.addNewSearch[0],
      ]);
    }

    if (mutationError) {
      setError(mutationError);
    }

    if (mutationLoading) {
      setSearchLoader(mutationLoading);
    }
  }, [mutationLoading, mutationError, searchData]);

  React.useEffect(() => {
    if (!loading && queryData) {
      updateSearchHistory(queryData);
    }
  }, [loading, queryData]);

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

  const geocodeAddress = async () => {
    setLoader(true);
    if (address.length === 0) {
      setError("Please Enter an Address");
    }
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setCoordinates({ ...coordinates, lat, lng });
      findHospital(lat, lng, address);
    } catch (error) {
      setLoader(false);
      setError(error.message);
    }
  };

  // Function to find nearby hospitals
  const findHospital = async (lat: number, lng: number, address: string) => {
    try {
      if (lat && lng) {
        const req_url: string = `${BASE_URL}/googleapi/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${formatType(
          searchType
        )}&keyword=${formatType(searchType)}&key=${API_KEY}`;

        const { data } = await axios.get(req_url, {
          headers: {},
        });

        if (data.status === "OK") {
          // setAddressState("");
          setLoader(false);
          const { uid, email } = auth.currentUser || {};

          setHospitalData([...data.results]);

          addNewSearch({
            variables: {
              address,
              searchType,
              radius,
              user: { uid, email },
            },
          });
        }

        if (data.status === "ZERO_RESULTS") {
          // setAddressState("");
          setLoader(false);
          setHospitalData([]);
          setError("No Data Found!");
        }

        if (data.status === "OVER_QUERY_LIMIT") {
          // setAddressState("");
          setLoader(false);
          setHospitalData([]);
          setError("API Quota Reached!");
        }

        if (data.status === "REQUEST_DENIED") {
          // setAddressState("");
          setLoader(false);
          setHospitalData([]);
          setError("API key Invalid!");
        }

        if (data.status === "UNKNOWN_ERROR") {
          // setAddressState("");
          setLoader(false);
          setHospitalData([]);
          setError("Error from Server, Pls try again later!");
        }
      } else {
        setLoader(false);
        setError("Pls Enter an Address to get coordinates!");
      }
    } catch (error) {
      setLoader(false);
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
        showLoader: setLoader,
        searchLoader,
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
