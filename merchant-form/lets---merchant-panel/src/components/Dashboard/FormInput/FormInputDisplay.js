import React from "react";

function FormInputDisplay({ text, value }) {
  return (
    <div className="form-group">
      <label className="color-faded-black">{text}</label>
      <input
        type="text"
        className="form-control form-text"
        placeholder=""
        value={value}
        disabled="disabled"
      />
    </div>
  );
}

export default FormInputDisplay;
