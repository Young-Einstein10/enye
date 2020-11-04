export interface HospitalData {
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

export interface SearchHistory {
  id: string;
  address: string;
  searchType: string;
  radius: number;
  createdOn: Date;
}

export type Props = {
  children?: React.ReactNode;
};

export type Coords = {
  lat: number;
  lng: number;
};

export type Location = {
  location?: Coords | null;
};

export interface ContextProps {
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
