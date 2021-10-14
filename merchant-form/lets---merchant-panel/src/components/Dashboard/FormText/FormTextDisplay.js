import React from "react";

function FormTextDisplay({ value, text }) {
  return (
    <div className="form-group">
      <label className="color-faded-black">{text}</label>
      <textarea
        className="form-control form-text"
        defaultValue={value}
        disabled="disabled"
        rows="8"
      />
    </div>
  );
}

export default FormTextDisplay;
