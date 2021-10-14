import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import StoreHours from "../../components/Dashboard/Store/StoreHours";
import Stepper from "../../components/Stepper/Stepper";
import { validateDailyHours } from "../../config/storeValidation";

const StepFour = ({
  infos,
  setInfos,
  classes,
  errors,
  setErrors,
  data,
  handleBack,
  handleNext,
}) => {
  const [isErrorDayHours, setIsErrorDayHours] = useState(false);
  const [errorDayHours, setErrorDayHours] = useState({});
  const handleSubmit = () => {
    const { isError, errorDayHours } = validateDailyHours(infos);
    if ((!infos.store_hours_start || !infos.store_hours_end) && isError) {
      if (isError && Object.keys(errorDayHours).length !== 0) {
        setIsErrorDayHours(isError);
        setErrorDayHours(errorDayHours);
        return setErrors((prevState) => ({
          ...prevState,
          errorTime: "Please complete the store hours.",
        }));
      } else {
        setIsErrorDayHours(false);
        return setErrors((prevState) => ({
          ...prevState,
          errorTime: "Please enter your store hours.",
        }));
      }
    } else {
      handleNext();
    }
  };
  return (
    <div className={classes.stepContainer}>
      <div>
        <StoreHours
          setInfos={setInfos}
          infos={infos}
          classes={classes}
          errorTime={errors.errorTime}
          setErrorTime={setErrors}
          errorDayHours={errorDayHours}
          setErrorDayHours={setErrorDayHours}
          isErrorDayHours={isErrorDayHours}
          isRequired
          edit={false}
        />
        <Typography
          variant="body2"
          color="error"
          style={{ marginTop: ".875rem" }}
        >
          {errors?.errorTime}
        </Typography>
      </div>
      <Stepper
        steps={8}
        activeStep={data.steps}
        handleNext={handleSubmit}
        handleBack={handleBack}
      />
    </div>
  );
};

export default StepFour;
