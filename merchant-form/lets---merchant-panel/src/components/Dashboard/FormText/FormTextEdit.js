import React from "react";

function FormTextEdit({
  type,
  value,
  text,
  name,
  onChange,
  placeholder,
  row,
  loading,
  ...rest
}) {
  return (
    <div className="form-group">
      <label className="color-faded-black">{text}</label>
      <textarea
        className="form-control"
        value={value ? value : ""}
        rows={row ? row : "8"}
        name={name}
        onChange={onChange}
        placeholder={placeholder ? placeholder : ""}
        disabled={type === "view" ? "disabled" : loading}
        {...rest}
      />
    </div>
  );
}

export default FormTextEdit;
