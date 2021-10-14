import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableRow: {
    borderTop: ".2px solid #fff",
    borderBottom: ".2px solid #fff",
  },
  selected: {
    backgroundColor: "rgb(255, 243, 204) !important",
    borderTop: ".2px solid #dfe8f1",
    borderBottom: ".2px solid #dfe8f1",
  },
  cellRoot: {
    border: "none",
    fontSize: "1rem !important",
    color: "#858796 !important",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    "& .dropdown": {
      width: 180,
    },
    "& .action-dropdown": {
      flex: ".3",
      marginRight: theme.spacing(2),
      [theme.breakpoints.down("md")]: {
        flex: ".4",
      },
    },
    "& .action-search-box": {
      flex: ".7",
      [theme.breakpoints.down("md")]: {
        flex: ".6",
      },
    },
  },
  dropDownItem: {
    paddingLeft: 0,
    paddingRight: 0,
    "& .dropdown-item": {
      display: "flex",
      alignItems: "center",
      "&:hover": {
        backgroundColor: "#e6e6e6",
      },
      "& p": {
        margin: 0,
        marginLeft: theme.spacing(1),
      },
    },
  },
  filterBtn: {
    margin: `${theme.spacing(1)}px ${theme.spacing(3)}px !important`,
    textTransform: "capitalize !important",
    "&.filter-active": {
      backgroundColor: "#4BA4FF",
      "& h6": {
        color: "#FFFFFF",
      },
    },
    [theme.breakpoints.down("md")]: {
      margin: `${theme.spacing(1)}px 0px !important`,
    },
  },
  paginationRoot: {
    "& div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
  },
  paginationSpacer: {
    display: "none !important",
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
  dateButton: {
    padding: 8,
    "&.active-date": {
      backgroundColor: "rgba(237, 60, 96, .35)",
    },
  },
  customDate: {
    paddingLeft: 3,
    "& .a": {
      fill: "none",
      stroke: "#ed3c60",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
    },
    "& .b": {
      fill: "none",
      stroke: "rgba(0, 0, 0, 0.54)",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
    },
  },
}));
