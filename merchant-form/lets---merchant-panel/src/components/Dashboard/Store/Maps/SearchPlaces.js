import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PinIcon from "@material-ui/icons/Room";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import "@reach/combobox/styles.css";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

function SearchPlaces({
  infos,
  panTo,
  center,
  setInfos,
  errorLocation,
  setErrorLocation,
  setCenter,
  newValue,
  classes,
}) {
  const storeProfile = useSelector((state) => state.user.storeProfile);
  const searchInputRef = useRef();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 600,
    requestOptions: {
      location: { lat: () => center.lat, lng: () => center.lng },
      radius: 250 * 1000,
    },
  });

  useEffect(() => {
    setValue(storeProfile.location_full_address);
    if (infos?.location_full_address) {
      setValue(infos.location_full_address);
    }
  }, [storeProfile, setValue, infos.location_full_address]);

  useEffect(() => {
    if (newValue) {
      setValue(newValue);
      setInfos((prevState) => ({
        ...prevState,
        location_full_address: newValue,
      }));
      searchInputRef.current.focus();
    }
  }, [newValue, setValue, setInfos]);

  const handleInput = (e) => {
    const { value } = e.target;
    if (errorLocation) {
      setErrorLocation((prevState) => ({ ...prevState, errorLocation: "" }));
    }
    setValue(value);
    setInfos((prevState) => ({
      ...prevState,
      location_full_address: value,
    }));
  };

  const handleSelect = async (address) => {
    if (errorLocation) {
      setErrorLocation((prevState) => ({ ...prevState, errorLocation: "" }));
    }
    setValue(address, false);
    setInfos((prevState) => ({
      ...prevState,
      location_full_address: address,
    }));
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setCenter({ lat, lng });
      setInfos((prevState) => ({
        ...prevState,
        location_lat: lat,
        location_lng: lng,
        place_id: results[0].place_id ? results[0].place_id : "",
      }));
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className={classes.search}>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
          className="form-control"
          name="location_full_address"
          ref={searchInputRef}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ description }, i) => {
                if (value === storeProfile.location_full_address) {
                  return null;
                }
                return (
                  <div key={i} className={classes.googleSearch}>
                    <PinIcon color="primary" fontSize="small" />
                    <ComboboxOption value={description} />
                  </div>
                );
              })}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default SearchPlaces;
