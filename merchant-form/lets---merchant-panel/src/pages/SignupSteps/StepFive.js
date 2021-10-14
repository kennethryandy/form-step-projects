import React from "react";
import StoreCategory from "../../components/Dashboard/Store/StoreCategory";
import Stepper from "../../components/Stepper/Stepper";

const StepFive = ({
  infos,
  setInfos,
  classes,
  errors,
  setErrors,
  data,
  handleBack,
  handleNext,
}) => {
  const handleSubmit = () => {
    // if (!infos.category?.length > 0) {
    //   return;
    // } else {
    //   handleNext();
    // }
    if (!infos.category) {
      return setErrors((prevState) => ({
        ...prevState,
        category: "Please select category for your store.",
      }));
    } else {
      handleNext();
    }
  };
  return (
    <div className={classes.stepContainer}>
      <StoreCategory
        isRequired
        classes={classes}
        infos={infos}
        setInfos={setInfos}
        errors={errors}
        setErrors={setErrors}
        yellow
      />
      <Stepper
        steps={8}
        activeStep={data?.steps}
        handleNext={handleSubmit}
        handleBack={handleBack}
        disabled={!infos.category?.length > 0}
      />
    </div>
  );
};

export default StepFive;
