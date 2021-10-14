import React, { Component } from "react";

class FormText extends Component {
  render() {
    const { type, value, text, name, handleChange } = this.props;
    const Textarea = () => {
      if (type === "add") {
        return (
          <textarea
            value={value}
            onChange={handleChange}
            className="form-control"
            placeholder=""
          ></textarea>
        );
      } else if (type === "edit") {
        return (
          <textarea
            className="form-control"
            placeholder=""
            value={value}
            rows="8"
            name={name}
            onChange={handleChange}
          />
        );
      } else {
        return (
          <textarea
            className="form-control form-text"
            placeholder=""
            value={value}
            disabled="disabled"
          />
        );
      }
    };

    return (
      <div className="form-group">
        <label className="color-faded-black">{text}</label>
        <Textarea />
      </div>
    );
  }
}

export default FormText;
