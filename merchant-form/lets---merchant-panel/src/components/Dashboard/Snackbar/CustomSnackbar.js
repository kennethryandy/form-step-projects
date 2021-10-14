import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import TransitionLeft from "../../SlideRight/TransitionLeft";

const CustomSnackbar = withStyles((theme) => ({
  deleteRoot: {
    "&>div": { backgroundColor: theme.palette.error.main, borderRadius: 10 },
    marginTop: 100,
    borderRadius: 10,
    padding: "2px 16px",
    minWidth: 0,
    "& .MuiSnackbarContent-message": {
      padding: 0,
    },
    "& .MuiSnackbarContent-root": {
      minWidth: 0,
    },
  },
  editRoot: {
    "&>div": {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 10,
    },
    marginTop: 95,
    borderRadius: 10,
    padding: "2px 16px",
    minWidth: 0,
    "& .MuiSnackbarContent-message": {
      padding: 0,
    },
    "& .MuiSnackbarContent-root": {
      minWidth: 0,
    },
  },
  complete: {
    "&>div": {
      backgroundColor: theme.palette.success.main,
      borderRadius: 10,
    },
    marginTop: 100,
    borderRadius: 10,
    padding: "2px 16px",
    minWidth: 0,
    "& .MuiSnackbarContent-message": {
      padding: 0,
    },
    "& .MuiSnackbarContent-root": {
      minWidth: 0,
    },
  },
}))(({ classes, type, ...props }) => (
  <Snackbar
    {...props}
    classes={{
      root:
        type === "edit"
          ? classes.editRoot
          : type === "complete"
          ? classes.complete
          : classes.deleteRoot,
    }}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    TransitionComponent={TransitionLeft}
  />
));

export default CustomSnackbar;
