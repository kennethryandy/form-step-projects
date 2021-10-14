import { useState } from "react";

const useValidate = () => {
  const [errors, setErrors] = useState({
    errorLocation: "",
    store_name: "",
    category: "",
    errorTime: "",
    phone_number: "",
    isError: false,
  });
  const [isErrors, setIsErrors] = useState(false);
  const validate = (data) => {
    if (!data?.place_id) {
      setErrors((prevState) => ({
        ...prevState,
        errorLocation: "Please select your location on the map.",
        isError: true,
      }));
      return setIsErrors(true);
    }
    if (!data?.store_name) {
      setErrors((prevState) => ({
        ...prevState,
        store_name: "Please enter the name of your store.",
        isError: true,
      }));
      return setIsErrors(true);
    }
    if (!data?.category || data?.category.length === 0) {
      setErrors((prevState) => ({
        ...prevState,
        category: "Please select categories of your store.",
        isError: true,
      }));
      return setIsErrors(true);
    }
    if (!data?.phone_number) {
      setErrors((prevState) => ({
        ...prevState,
        phone_number: "Please enter your phone number.",
        isError: true,
      }));
      return setIsErrors(true);
    }
    return setIsErrors(false);
    // setErrors((prevState) => ({
    //   ...prevState,
    //   errorLocation: data?.place_id
    //     ? prevState.errorLocation
    //     : "Please select your location on the map.",
    //   store_name: data?.store_name
    //     ? prevState.store_name
    //     : "Please enter the name of your store.",
    //   category:
    //     data?.category > 0
    //       ? prevState.category
    //       : "Please select categories of your store.",
    //   phone_number: data.phone_number
    //     ? prevState.place_id
    //     : "Please enter your phone number.",
    // }));
  };
  return [errors, setErrors, validate, isErrors];
};

export default useValidate;
