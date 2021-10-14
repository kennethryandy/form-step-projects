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
    "& .dropdown-item.active": {
      backgroundColor: "none",
    },
  },
  filterBtn: {
    margin: `${theme.spacing(1)}px ${theme.spacing(3)}px !important`,
    textTransform: "capitalize !important",
    "&.filter-active": {
      backgroundColor: "#e6e6e6",
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
  title: {
    fontWeight: "bold",
  },
  infoLabel: {
    marginBottom: 12,
  },
  infos: {
    marginTop: theme.spacing(3),
  },
  card: {
    padding: 0,
    "& .card-header": {
      backgroundColor: ({isBanned}) => isBanned ? theme.palette.text.disabled : "#ed3c60",
      "& p": {
        color: "#fff",
      },
    },
  },
  cardContent: {
    padding: theme.spacing(2),
    paddingBottom: "16px !important",
  },
  orderBig: {
    fontSize: 40,
    fontWeight: "bold",
    color: ({isBanned}) => isBanned ? theme.palette.text.disabled : "#ed3c60",
    "& span": {
      fontSize: 24,
    },
  },
  imageSquare: {
    width: 380,
    height: 400,
    padding: 20,
    paddingLeft: 0,
    margin: "auto 0px",
    "& img": {
      height: "100%",
      width: "100%",
      marginTop: 12,
      borderRadius: 15,
      border: "1px solid rgb(133, 135, 150, .5)",
    },
  },
}));
