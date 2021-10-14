import React from "react";

const InputFormControl = ({ label, required, error, ...props }) => {
  return (
    <>
      <label className="mb-2">
        {label} {required && <span>*</span>}
      </label>
      <input
        {...props}
        className="form-control"
        style={{ borderColor: error ? "red" : "#dfe8f1" }}
      />
    </>
  );
};

export default InputFormControl;
