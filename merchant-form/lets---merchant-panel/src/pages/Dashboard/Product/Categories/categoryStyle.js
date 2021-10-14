import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  paperRoot: {
    minHeight: "50vh",
  },
  listTop: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    display: "flex",
    alignItems: "center",
  },
  listTopTitle: {
    color: "#858796",
  },
  chipRoot: {
    margin: theme.spacing(1),
    fontSize: "1rem",
    height: 46,
    borderRadius: 12,
    width: 172,
    "& svg": {
      marginLeft: "auto",
    },
    [theme.breakpoints.only("xs")]: {
      width: "40%",
      height: 38,
      fontSize: ".8rem",
    },
  },
  chipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
  },
  selectBtn: {
    flex: ".6",
    padding: "12px 22px",
    marginLeft: theme.spacing(3),
    borderRadius: 10,
    color: "#FFF",
    [theme.breakpoints.only("xs")]: {
      marginLeft: theme.spacing(1),
      padding: "8px 22px",
    },
  },
  selected: {
    backgroundColor: "#FFC001",
    "&:focus": {
      backgroundColor: "#FFC001",
    },
    "&:hover": {
      backgroundColor: "#FFC001",
    },
  },
  snackBarSuccess: {
    "&>div": {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 10,
    },
  },
  snackBarError: {
    "&>div": { backgroundColor: theme.palette.error.main, borderRadius: 10 },
  },
  snackbar: {
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
}));
