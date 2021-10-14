import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";

class CustomDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeText: null,
    };
  }

  handleClick(list, index) {
    this.setState({
      activeText: list,
    });

    if (this.props.customFunc) {
      this.props.customFunc(list, index);
    }
  }

  render() {
    const { newClass, value, lists } = this.props;

    return (
      <Dropdown>
        <Dropdown.Toggle
          ref={this.dropdownToggle}
          variant="default"
          className={newClass}
        >
          {this.state.activeText != null ? this.state.activeText : value}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {lists.map((list, index) => {
            return (
              <Dropdown.Item
                key={index}
                eventKey={index}
                onClick={() => this.handleClick(list, index)}
              >
                {list}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default CustomDropdown;
