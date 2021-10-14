import React, { Component } from "react";

class CollapseList extends Component {
  constructor() {
    super();

    this.itemref = React.createRef();
  }

  static Toggle = (props) => <SidebarToggle {...props} />;
  static Item = (props) => <SidebarItem {...props} />;

  render() {
    const { className, children } = this.props;

    return (
      <li className={"nav-item " + className}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { itemref: this.itemref })
        )}
      </li>
    );
  }
}

class SidebarToggle extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.toggleref = React.createRef();
  }

  handleCollapse(itemref) {
    const collapse = itemref.current;
    const classList = collapse.classList.value.split(" ");
    let height = 0;
    console.log(classList);
    clearTimeout(this.timer);
    if (!classList.includes("show")) {
      collapse.style.display = "block";
      height = collapse.getElementsByClassName("collapse-inner")[0]
        .clientHeight;
    } else {
      this.timer = setTimeout(function () {
        collapse.style.display = "none";
      }, 300);
    }

    collapse.style.maxHeight = height + "px";
    itemref.current.classList.toggle("show");
    this.toggleref.current.classList.toggle("open");
  }

  render() {
    // const { href, children, itemref } = this.props;
    const { children, itemref } = this.props;
    return (
      <button
        ref={this.toggleref}
        className="nav-link collapsed"
        data-toggle="collapse"
        data-target="#collapseTwo"
        aria-expanded="true"
        onClick={() => this.handleCollapse(itemref)}
      >
        {children}
      </button>
    );
  }
}

class SidebarItem extends React.Component {
  render() {
    const { children, itemref } = this.props;

    return (
      <div className="collapse" ref={itemref}>
        <div className="collapse-inner">{children}</div>
      </div>
    );
  }
}

export default CollapseList;
