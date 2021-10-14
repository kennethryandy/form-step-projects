import React, { useState } from "react";
import Stepper from "../../components/Stepper/Stepper";
import StoreLogo from "../../components/Dashboard/Store/StoreLogo";

const StepThree = ({
  data,
  handleBack,
  handleNext,
  classes,
  file,
  setFile,
  progress,
  setProgress,
  setInfos,
  infos,
}) => {
  const [error, setError] = useState("");
  return (
    <div className={classes.stepContainer}>
      <div className="mb-3">
        <StoreLogo
          setInfos={setInfos}
          classes={classes}
          file={file}
          setFile={setFile}
          progress={progress}
          setProgress={setProgress}
          error={error}
          setError={setError}
        />
      </div>
      <Stepper
        steps={8}
        activeStep={data.steps}
        handleNext={handleNext}
        handleBack={handleBack}
        nextText={infos.store_logo_file_id ? "" : "Skip"}
        disabled={progress === 0 ? false : progress === 100 ? false : true}
      />
    </div>
  );
};

export default StepThree;
