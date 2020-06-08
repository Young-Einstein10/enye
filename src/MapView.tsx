import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import * as hospitals from "./hospitals.json";
import { API_KEY } from "./config";

const hospitalData = hospitals.results;

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const libraries = ["places"];

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const MapView = () => {
  const [mapCenter, setMapCenter] = useState({
    lat: -33.8670522,
    lng: 151.1957362,
  });
  const [selectedHospital, setSelectedHospital] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={options}
        zoom={14}
        center={mapCenter}
      >
        {/* Markers */}
        {hospitalData.map(marker => (
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
              <p>{selectedHospital.rating}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
