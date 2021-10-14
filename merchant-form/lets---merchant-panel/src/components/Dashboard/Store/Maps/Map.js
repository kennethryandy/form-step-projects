import React, { useState, useCallback, useRef } from "react";
import vars from "../../../../config/variables";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { getDetails } from "use-places-autocomplete";
import useStyles from "./mapStyles";
import SearchPlaces from "./SearchPlaces";
import axios from "axios";
import MapModal from "./MapModal";
import { useSelector } from "react-redux";

const mapContainerStyle = {
  width: "100%",
  height: "185px",
};
const mapContainerStyleCustom = {
  width: "100%",
  height: "300px",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
const libraries = ["places"];
function Map({
  infos,
  setInfos,
  errorLocation,
  setErrorLocation,
  mapCustomStyle,
  isRequired,
}) {
  const storeProfile = useSelector((state) => state.user.storeProfile);
  const classes = useStyles();
  const [center, setCenter] = useState({
    lat: storeProfile.location_lat ? +storeProfile.location_lat : 14.676208,
    lng: storeProfile.location_lng ? +storeProfile.location_lng : 121.043861,
  });
  const [newValue, setNewValue] = useState("");
  const [isEstablishment, setIsEstablishment] = useState({
    open: false,
    preview_img: "",
    place_name: "",
  });
  const mapRef = useRef();
  const showPosition = useRef(() => {});
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: vars.googleApiKey,
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  showPosition.current = (position) => {
    setInfos((prevState) => ({
      ...prevState,
      location_lat: position.coords.latitude,
      location_lng: position.coords.longitude,
    }));
    setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  };

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  const onMapClick = useCallback(
    (e) => {
      setErrorLocation((prevState) => ({ ...prevState, errorLocation: "" }));
      if (e.placeId) {
        getDetails({ placeId: e.placeId })
          .then((details) => {
            setIsEstablishment({
              open: true,
              icon: details.icon,
              place_name: details.name,
              location: details.vicinity,
              details,
            });
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .get(
            `${url}${e.latLng.lat()},${e.latLng.lng()}&key=${vars.googleApiKey}`
          )
          .then((res) => {
            if (res.data.status === "OK") {
              setInfos((prevState) => ({
                ...prevState,
                location_full_address: res.data.results[0].formatted_address,
                place_id: res.data.results[0].place_id,
              }));
              setNewValue(res.data.results[0].formatted_address);
            }
          })
          .catch((err) => console.error(err));
      }
      setCenter({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      setInfos((prevState) => ({
        ...prevState,
        location_lat: e.latLng.lat(),
        location_lng: e.latLng.lng(),
      }));
    },
    [setInfos, setIsEstablishment, errorLocation, setErrorLocation]
  );

  const handleDragEnd = useCallback((e) => {
    if (errorLocation) {
      setErrorLocation((prevState) => ({ ...prevState, errorLocation: "" }));
    }
    axios
      .get(`${url}${e.latLng.lat()},${e.latLng.lng()}&key=${vars.googleApiKey}`)
      .then((res) => {
        if (res.data.status === "OK") {
          setInfos((prevState) => ({
            ...prevState,
            place_id: res.data.results[0].place_id,
            location_full_address: res.data.results[0].formatted_address,
            location_lat: e.latLng.lat(),
            location_lng: e.latLng.lng(),
          }));
          getDetails({
            placeId: res.data.results[0].place_id,
          }).then((details) => {
            if (details.types.includes("establishment")) {
              setIsEstablishment({
                open: true,
                icon: details.icon,
                place_name: details.name,
                location: details.vicinity,
                details,
              });
            }
          });
          setNewValue(res.data.results[0].formatted_address);
        }
      })
      .catch((err) => console.error(err));
    setCenter({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
    // eslint-disable-next-line
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <>
      <label className={classes.label}>
        Store Location Address {isRequired ? <span>*</span> : ""}
      </label>
      <SearchPlaces
        center={center}
        panTo={panTo}
        setInfos={setInfos}
        errorLocation={errorLocation}
        setErrorLocation={setErrorLocation}
        setCenter={setCenter}
        newValue={newValue}
        classes={classes}
        infos={infos}
      />
      <GoogleMap
        mapContainerStyle={
          mapCustomStyle ? mapContainerStyleCustom : mapContainerStyle
        }
        zoom={16}
        center={center}
        onLoad={onMapLoad}
        options={options}
        onClick={onMapClick}
      >
        <Marker
          draggable={true}
          position={{ lat: center.lat, lng: center.lng }}
          onDragEnd={handleDragEnd}
        />
      </GoogleMap>
      <MapModal
        isEstablishment={isEstablishment}
        setIsEstablishment={setIsEstablishment}
        setNewValue={setNewValue}
        setInfos={setInfos}
        classes={classes}
      />
    </>
  );
}

export default Map;
