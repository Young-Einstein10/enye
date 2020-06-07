import React, { useRef, useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";

const googleMap = () => {
  const [zoomLevel, setZoomLevel] = useState(15);
  const [lat, setLat] = useState(51.4934);
  const [lng, setLng] = useState(0.0098);
  const [state, setState] = useState({
    activeMarker: {},
    showingInfoWindow: false,
    text: "",
  });

  const mapStyles = {
    width: "100%",
    height: "100%",
  };

  // useEffect(() => {
  //   // console.log(mapEl.current);
  //   initMap();
  // }, []);

  // var map;
  // var service;
  // var infowindow;

  // function initMap() {
  //   var sydney = new google.maps.LatLng(-33.867, 151.195);

  //   infowindow = new google.maps.InfoWindow();

  //   map = new google.maps.Map(mapEl.current, { center: sydney, zoom: 15 });

  //   var request = {
  //     query: "Museum of Contemporary Art Australia",
  //     fields: ["name", "geometry"],
  //   };

  //   service = new google.maps.places.PlacesService(map);

  //   service.findPlaceFromQuery(request, function(results, status) {
  //     if (status === google.maps.places.PlacesServiceStatus.OK) {
  //       for (var i = 0; i < results.length; i++) {
  //         createMarker(results[i]);
  //       }

  //       map.setCenter(results[0].geometry.location);
  //     }
  //   });
  // }

  // function createMarker(place) {
  //   var marker = new google.maps.Marker({
  //     map: map,
  //     position: place.geometry.location,
  //   });

  //   google.maps.event.addListener(marker, "click", function() {
  //     infowindow.setContent(place.name);
  //     infowindow.open(map, this);
  //   });
  // }

  const onMarkerClick = (props, marker) => {
    setState({
      ...state,
      activeMarker: marker,
      showingInfoWindow: true,
      text: marker.text || "",
    });
  };

  const onInfoWindowClose = () => {
    setState({
      activeMarker: null,
      showingInfoWindow: false,
    });
  };

  return (
    <>
      <Map
        google={google}
        zoom={zoomLevel}
        style={mapStyles}
        initialCenter={{ lat, lng }}
      >
        <Marker
          position={{
            lat: -33.867,
            lng: 151.195,
          }}
          icon={}
          onClick={onMarkerClick}
          text="some text"
        />
        <InfoWindow
          marker={state.activeMarker}
          onClose={onInfoWindowClose}
          visible={state.showingInfoWindow}
        >
          <div>
            <p>{state.text}</p>
          </div>
        </InfoWindow>
      </Map>
    </>
  );
};

export default googleMap;
