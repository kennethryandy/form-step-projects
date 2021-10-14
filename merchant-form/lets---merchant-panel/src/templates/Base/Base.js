import React, { Component } from "react";
import "./Base.css";

class Base extends Component<IProps> {
	render() {
		return (
			<div>
				{this.props.childComp}
			</div>
		);
	}
}

export default Base;
