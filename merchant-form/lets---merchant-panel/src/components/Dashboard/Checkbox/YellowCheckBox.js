import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";

const YellowCheckBox = withStyles({
  root: {
    color: "#212121",
    "&$checked": {
      color: "#ffc001",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default YellowCheckBox;
