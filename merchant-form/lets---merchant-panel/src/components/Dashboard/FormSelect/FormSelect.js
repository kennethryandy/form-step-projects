import React, { Component } from "react";

import CustomDropdown from "./../../CustomDropdown";

class FormSelect extends Component {
  state = {
    activeText: null,
  };

  handleClick(list, index) {
    this.setState({
      activeText: list,
    });
  }

  render() {
    // const { type, value, name, text, lists } = this.props;
    const { type, value, text, lists, handleChange } = this.props;

    const Input = () => {
      if (type === "add") {
        return (
          <CustomDropdown
            newClass="form-control dropdown-toggle dropdown-toggle-violet text-left"
            value=""
            lists={lists}
          />
        );
      } else if (type === "edit") {
        return (
          <CustomDropdown
            newClass="form-control dropdown-toggle dropdown-toggle-violet text-left"
            value={value}
            lists={lists}
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

export default FormSelect;
