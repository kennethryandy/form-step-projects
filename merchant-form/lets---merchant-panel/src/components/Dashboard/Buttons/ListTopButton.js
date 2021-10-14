import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const ListTopButton = withStyles((theme) => ({
  outlined: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      borderColor: theme.palette.primary.main,
    },
    [theme.breakpoints.down("sm")]: {
      padding: "3px 8px",
      fontSize: ".725rem",
      "& .MuiSvgIcon-root": {
        fontSize: 14,
      },
      "& .MuiButton-endIcon": {
        marginLeft: 0,
      },
    },
  },
  contained: {
    border: `1px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: 16,
    [theme.breakpoints.down("md")]: {
      paddingLeft: 12,
      paddingRight: 12,
      fontSize: 14,
      paddingTop: 7,
      paddingBottom: 7,
    },
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
    "&:hover": {
      backgroundColor: "#fff",
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    },
  },
  disabled: {
    border: `1px solid ${theme.palette.grey[500]}`,
  },
  secondary: {
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: "#fff",
      borderColor: theme.palette.secondary.main,
    },
  },
  label: {
    textTransform: "capitalize",
  },
}))(({ children, buttonType, classes, ...props }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      className={buttonType === "secondary" ? classes.secondary : ""}
      classes={{ ...classes, secondary: null }}
      {...props}
    >
      {children}
    </Button>
  );
});

export default ListTopButton;
