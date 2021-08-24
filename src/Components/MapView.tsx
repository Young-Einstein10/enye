import React, { useState, useContext, FunctionComponent } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import mapStyles from "../mapStyles";
import locationContext from "../Context/location/Context";

import { API_KEY } from "../utils/config";

const mapContainerStyle = {
  width: "100vw",
  height: "calc(100vh - 70px)",
};

const libraries = ["places"];

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

interface MapCenter {
  lat: number;
  lng: number;
}

const MapView: FunctionComponent = () => {
  const [mapCenter, setMapCenter] = useState<MapCenter>({
    lat: -33.8670522,
    lng: 151.1957362,
  });
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const context = useContext(locationContext);
  const { hospitalData } = context;

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading Maps...</p>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={options}
        zoom={14}
        center={mapCenter}
      >
        {/* Markers */}
        {hospitalData?.map((marker) => (
          <Marker
            key={marker.id}
            position={{
              lat: marker.geometry.location.lat,
              lng: marker.geometry.location.lng,
            }}
            onClick={() => {
              setSelectedHospital(marker);
            }}
            onLoad={() => {
              console.log(`Marker for ${marker.name} loaded...`);
              setMapCenter({
                ...mapCenter,
                lat: marker.geometry.location.lat,
                lng: marker.geometry.location.lng,
              });
            }}
          />
        ))}

        {/* InfoWindow */}
        {selectedHospital && (
          <InfoWindow
            position={{
              lat: selectedHospital.geometry.location.lat,
              lng: selectedHospital.geometry.location.lng,
            }}
            onCloseClick={() => setSelectedHospital(null)}
          >
            <div>
              <h2>{selectedHospital.name}</h2>
              <p>{selectedHospital.vicinity}</p>
              <p>rating: {selectedHospital.rating}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
