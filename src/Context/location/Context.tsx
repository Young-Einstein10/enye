import * as React from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { API_KEY } from "../../utils/config";
// import { firestore } from "../utils/Firebase";
import { auth } from "../../utils/Firebase";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GetUserDetailsQuery = gql`
  query GetUserDetails($id: ID!) {
    user(id: $id) {
      id
      fullname
      email
      searchHistory {
        id
        address
        searchType
        radius
        createdOn
      }
    }
  }
`;

const ADD_NEW_SEARCH = gql`
  mutation addNewSearch(
    $address: String!
    $radius: Int!
    $searchType: String!
    $user: UserSearchType
  ) {
    addNewSearch(
      address: $address
      radius: $radius
      searchType: $searchType
      user: $user
    ) {
      id
      address
      radius
      searchType
      createdOn
      user {
        uid
        email
      }
    }
  }
`;

type Props = {
  children?: React.ReactNode;
};

type Coords = {
  lat: number;
  lng: number;
};

type Location = {
  location?: Coords | null;
};

interface ContextProps {
  loader: boolean;
  error: any;
  // nextPageToken: string;
  hospitalData: HospitalData[];
  searchHistory: SearchHistory[];
  searchLoader: boolean;
  showLoader: (action: boolean) => void;
  radius: number;
  setGeoRadius: (value: number) => void;
  setError?: any;
  setLocationCoords: (lat: number, lng: number) => void;
  setType: (value: string) => void;
  findHospital: (lat: number, lng: number, address: string) => void;
  setAddressState: (newAddress: string) => void;
  geocodeAddress: () => void;
}

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

const isProd =
  process.env.NODE_ENV === "production"
    ? "https://maps.googleapis.com/"
    : "/googleapi/";
interface HospitalData {
  id: string;
  rating: number | null;
  name: string;
  icon?: string;
  vicinity: string | any;
  business_status: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface SearchHistory {
  id: string;
  address: string;
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
        const req_url: string = `${isProd}maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${formatType(
          searchType
        )}&keyword=${formatType(searchType)}&key=${API_KEY}`;
        const { data } = await axios.get(req_url, {
          headers: {
            origin: null,
          },
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
