import React from "react";
import Map from "../../components/Dashboard/Store/Maps/Map";
import InputFormControl from "../../components/InputFormControl/InputFormControl";
import Typography from "@material-ui/core/Typography";
import Stepper from "../../components/Stepper/Stepper";

const StepTwo = ({
  data,
  errors,
  setErrors,
  infos,
  setInfos,
  handleBack,
  handleChange,
  handleNext,
  classes,
}) => {
  const handleSubmit = () => {
    if (!infos.store_name || !infos.location_full_address || !infos.place_id) {
      setErrors((prevState) => ({
        ...prevState,
        store_name: infos.store_name
          ? ""
          : "Please enter your store name or select your store in the map.",
        errorLocation:
          infos.location_full_address && infos.place_id
            ? ""
            : "Please select your location on the map.",
      }));
    } else {
      handleNext();
    }
  };
  return (
    <div className={classes.stepContainer}>
      <div className="mb-3">
        <InputFormControl
          label="Store Name"
          required
          name="store_name"
          placeholder="Enter your store name"
          value={infos.store_name}
          onChange={handleChange}
          error={errors?.store_name}
        />
        <Typography
          variant="body2"
          color="error"
          style={{ marginTop: ".875rem" }}
        >
          {errors?.store_name}
        </Typography>
      </div>
      <div className="mb-5">
        <Map
          errorLocation={errors?.errorLocation}
          setErrorLocation={setErrors}
          infos={infos}
          setInfos={setInfos}
          mapCustomStyle
        />
        <Typography
          variant="body2"
          color="error"
          style={{ marginTop: ".875rem" }}
        >
          {errors?.errorLocation}
        </Typography>
      </div>
      <Stepper
        steps={8}
        activeStep={data.steps}
        handleNext={handleSubmit}
        handleBack={handleBack}
        disabled={
          !infos.store_name || !infos.location_full_address || !infos.place_id
        }
      />
    </div>
  );
};

export default StepTwo;
