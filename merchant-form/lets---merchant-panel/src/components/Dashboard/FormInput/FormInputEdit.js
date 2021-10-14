import React from "react";

function FormInputEdit({
  onChange,
  name,
  value,
  text,
  inputType,
  placeholder,
  type,
  ...props
}) {
  return (
    <div className="form-group">
      <label className="color-faded-black">{text}</label>
      <input
        className="form-control"
        required
        value={value ? value : ""}
        name={name}
        onChange={onChange}
        type={inputType ? inputType : "text"}
        placeholder={placeholder ? placeholder : ""}
        disabled={type === "view"}
        {...props}
      />
    </div>
  );
}

export default FormInputEdit;
