import React, { useEffect } from "react";
import Stepper from "../../components/Stepper/Stepper";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Typography from "@material-ui/core/Typography";

const StepSeven = ({
  data,
  handleNext,
  handleBack,
  infos,
  errors,
  classes,
  setErrors,
  handleChange,
}) => {
  useEffect(() => {
    if (infos?.store_description && infos?.store_description.length > 255) {
      setStoreDescError();
    }
  }, [infos?.store_description]);

  const setStoreDescError = () => {
    setErrors((prevState) => ({
      ...prevState,
      store_description:
        "Store description must be no longer than 255 characters.",
    }));
  };
  const handleSubmit = () => {
    if (infos.store_description.length > 255) {
      return;
    } else {
      handleNext();
    }
  };
  const onStoreDescKeyDown = (e) => {
    if (e.target.value.length > 254 && e.key !== "Backspace") {
      e.preventDefault();
    } else {
      return;
    }
  };

  return (
    <div className={classes.stepContainer}>
      <div>
        <label>
          Store Description{" "}
          <Typography variant="body2" color="textSecondary" display="inline">
            (Optional)
          </Typography>
        </label>
        <TextareaAutosize
          placeholder="Type here..."
          rows={4}
          rowsMax={6}
          className="form-control edit"
          name="store_description"
          onChange={handleChange}
          style={{
            border: errors.store_description
              ? "1px solid red"
              : "1px solid #d1d3e2",
          }}
          value={infos.store_description}
          onKeyDown={onStoreDescKeyDown}
        />
        <div className="w-100">
          <Typography
            variant="caption"
            className="text-right"
            color={errors.store_description ? "error" : "textSecondary"}
            component="p"
          >
            {infos.store_description ? infos.store_description.length : 0}
            /255
          </Typography>
        </div>
        <Typography variant="body2" color="error" className="mb-2">
          {errors.store_description}
        </Typography>
      </div>
      <Stepper
        steps={8}
        activeStep={data?.steps}
        handleNext={handleSubmit}
        handleBack={handleBack}
        nextText={infos.store_description ? "" : "Skip"}
      />
    </div>
  );
};

export default StepSeven;
