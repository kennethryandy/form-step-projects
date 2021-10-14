import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  storeRoot: {
    margin: `${theme.spacing(2)}px 0px`,
    padding: 0,
    "&>div": {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(2),
      "&>hr": {
        width: "100%",
        position: "absolute",
        left: 10,
        margin: "-4px",
      },
    },
  },
  logo: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      border: "1px solid",
      borderRadius: 12,
      width: 240,
      height: 210,
      [theme.breakpoints.only("xs")]: {
        width: 160,
        height: 140,
      },
    },
  },
  title: {
    fontWeight: "bold",
  },
  info: {
    marginBottom: theme.spacing(2),
  },
  infoTitle: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  dayHours: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    "&>div": {
      display: "flex",
    },
    "& label": {
      minWidth: 85,
    },
  },
}));
