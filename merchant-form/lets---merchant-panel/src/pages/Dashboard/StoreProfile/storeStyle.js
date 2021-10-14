import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  paperRoot: {
    margin: `${theme.spacing(5)}px 0px`,
  },
  storeTitle: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
      margin: 0,
      fontWeight: 'bold'
    },
  },
  gridItem: {
    padding: `0px ${theme.spacing(2)}px`,
  },
  storeLogo: {
    width: "90%",
    height: "auto",
    marginTop: 12,
    position: "absolute",
    borderRadius: 12,
    border: ({ noImg }) =>
      noImg ? "none" : "1px solid rgb(133, 135, 150, .5)",
    objectFit: ({ noImg }) => (noImg ? "contain" : "none"),
    backgroundColor: ({ noImg }) => (noImg ? "#d1d3e2" : "transparent"),
    padding: ({ noImg }) => (noImg ? 32 : 0),
    [theme.breakpoints.down("md")]: {
      height: 240,
    },
  },
  title: {
    fontWeight: "bold",
  },
  infoLabel: {
    marginBottom: 12,
  },
  infos: {
    // margin: `${theme.spacing(3)}px 0px`,
    marginTop: theme.spacing(3),
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  chipRoot: {
    margin: theme.spacing(1),
    fontSize: "1rem !important",
    height: "46px !important",
    borderRadius: "12px !important",
    width: 160,
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
    "& > div": {
      margin: theme.spacing(1),
      [theme.breakpoints.only("xs")]: { margin: 0 },
    },
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
  customDropDown: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1.6px solid #d1d3e2",
    borderRadius: 6,
    padding: "4.5px 10px",
    background: "#f4f4f8",
    margin: `${theme.spacing(2)}px 0px`,
    position: "relative",
    "& svg": { cursor: "pointer" },
    "& input": {
      padding: "5px",
      border: "none",
      fontSize: "1rem",
      fontWeight: 400,
      color: "#3c397c",
      background: "none",
      "&:focus": {
        outline: "none",
      },
      "&::placeholder": {
        color: "#3c397c",
        opacity: "0.5",
      },
    },
  },
  timeContainer: {
    display: "flex",
    [theme.breakpoints.down("sm")]: { flexDirection: "column" },
    "& input": {
      [theme.breakpoints.up("md")]: { width: "80%" },
    },
  },
  hoursLabelCheckbox: {
    [theme.breakpoints.only("xs")]: { marginLeft: "0px !important" },
    "& span:last-child": {
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
  hourList: {
    maxHeight: 200,
    zIndex: 999,
    width: "100%",
    position: "absolute",
    overflowY: "scroll",
    borderRadius: 4,
    padding: 0,
    top: 42,
    left: 0,
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
  },
  dayHours: {
    display: "flex",
    marginBottom: theme.spacing(2),
    "&>div": {
      display: "flex",
    },
  },
  hoursLabel: {
    width: 95,
  },
  divider: {
    position: "absolute",
    bottom: "-16px",
    zIndex: 999,
    // width: "100%",
    backgroundColor: "transparent",
    opacity: 1,
    width: 640,
    [theme.breakpoints.down("md")]: {
      width: 320,
    },
    [theme.breakpoints.down("sm")]: {
      width: 125,
    },
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
  snackBarSuccess: {
    "&>div": {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 10,
    },
  },
}));
