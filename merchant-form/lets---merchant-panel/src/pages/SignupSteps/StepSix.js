import React from "react";
import Stepper from "../../components/Stepper/Stepper";
import phLogo from "../../assets/images/icon/ph.webp";
import Typography from "@material-ui/core/Typography";
import { validateNums } from "../../helpers/validateNums";

const StepSix = ({
  data,
  handleNext,
  handleBack,
  infos,
  setInfos,
  errors,
  setErrors,
  handleChange,
  classes,
}) => {
  const handleSubmit = () => {
    if (!infos.phone_number) {
      return setErrors((prevState) => ({
        ...prevState,
        phone_number: "Phone number must not be empty.",
      }));
    }
    if (errors.phone_number || errors.landline_number) {
      return;
    } else {
      handleNext();
    }
  };
  return (
    <div className={classes.stepContainer}>
      <div>
        <div>
          <label>
            Phone Number <span>*</span>
          </label>
          <InputNumber
            infos={infos}
            setInfos={setInfos}
            setErrors={setErrors}
            type="text"
            className="form-control edit"
            placeholder="+639 828 277 211"
            onChange={handleChange}
            value={infos.phone_number}
            name="phone_number"
            error={errors.phone_number}
          />
          <Typography variant="body2" color="error" className="mb-2">
            {errors?.phone_number}
          </Typography>
        </div>
        <div>
          <label>
            Landline Number{" "}
            <Typography variant="body2" color="textSecondary" display="inline">
              (Optional)
            </Typography>
          </label>
          <InputNumber
            infos={infos}
            setInfos={setInfos}
            setErrors={setErrors}
            type="text"
            placeholder="(123)-123-123"
            className="form-control edit"
            name="landline_number"
            onChange={handleChange}
            value={infos.landline_number}
            error={errors.landline_number}
          />
        </div>
        <Typography variant="body2" color="error" className="mb-2">
          {errors?.landline_number}
        </Typography>
      </div>
      <Stepper
        steps={8}
        activeStep={data?.steps}
        handleNext={handleSubmit}
        handleBack={handleBack}
        disabled={!infos.phone_number}
      />
    </div>
  );
};

const InputNumber = ({
  infos,
  setInfos,
  handleChange,
  setErrors,
  name,
  error,
  ...rest
}) => {
  const handleFocus = (e) => {
    let newValue = e.target.value.replace(/[^0-9]+/g, "");
    setInfos((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleKeyDown = (e) => {
    if (e.target.value.length > 10 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };
  const handleBlur = (e) => {
    let newValue = e.target.value.replace(/[^0-9]+/g, "");
    let origValue = e.target.value.replace(/[^0-9]+/g, "");
    if (origValue.length < 10 && name === "phone_number") {
      setErrors((prevState) => ({
        ...prevState,
        phone_number: "Phone number must at least be 10 digits long.",
        isErrors: false,
      }));
    } else if (origValue.length < 10 && infos.landline_number > 0) {
      setErrors((prevState) => ({
        ...prevState,
        landline_number: "Landline number must at least be 10 digits long.",
        isErrors: false,
      }));
    } else if (!origValue.startsWith("9") && name === "phone_number") {
      setErrors((prevState) => ({
        ...prevState,
        phone_number: "Phone number must starts with number (9).",
        isErrors: false,
      }));
    }
    if (!origValue && name === "phone_number") {
      setErrors((prevState) => ({
        ...prevState,
        phone_number: "Phone number must not be empty.",
      }));
    } else if (newValue.length > 3) {
      newValue =
        newValue.slice(0, 3) +
        "-" +
        newValue.slice(3, 6) +
        "-" +
        newValue.slice(6);
    }
    setInfos((prevState) => ({ ...prevState, [name]: newValue }));
  };

  return (
    <div className="input-group">
      {name === "phone_number" && (
        <div className="input-group-prepend">
          <span
            className="input-group-text"
            style={{
              padding: "0px 8px",
              height: 42,
              margin: "auto",
              borderColor: error ? "red" : "#dfe8f1",
            }}
          >
            <img src={phLogo} alt="" style={{ width: 30, height: 20 }} />
            <Typography variant="body1" style={{ margin: "0px 8px" }}>
              +63
            </Typography>
          </span>
        </div>
      )}
      <input
        style={{
          // marginRight: name === "phone_number" ? 24 : 0,
          borderColor: error ? "red" : "#dfe8f1",
        }}
        {...rest}
        name={name}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onKeyPress={validateNums}
      />
    </div>
  );
};

export default StepSix;
