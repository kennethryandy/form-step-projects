import React, { Component } from "react";

class FormInput extends Component {
  render() {
    const { type, value, text, name, handleChange } = this.props;

    const Input = () => {
      if (type === "add") {
        return (
          <input
            type="text"
            className="form-control"
            placeholder=""
            required="required"
            name={name}
            value={value}
            onChange={handleChange}
          />
        );
      } else if (type === "edit") {
        return (
          <input
            type="text"
            className="form-control"
            placeholder=""
            required="required"
            value={value}
            name={name}
            onChange={handleChange}
          />
        );
      } else {
        return (
          <input
            type="text"
            className="form-control form-text"
            placeholder=""
            defaultValue={value}
            disabled="disabled"
          />
        );
      }
    };

    return (
      <div className="form-group">
        <label className="color-faded-black">{text}</label>
        <Input />
      </div>
    );
  }
}

export default FormInput;
