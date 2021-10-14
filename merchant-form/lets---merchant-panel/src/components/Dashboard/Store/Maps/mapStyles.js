import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  googleSearch: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1),
    "& span": {
      "&[data-user-value]": { color: "#000", fontWeight: 600 },
      "&[data-suggested-value]": { color: "#7F7F7F" },
    },
  },
  search: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  rootDialog: {
    "& .MuiBackdrop-root": {
      backgroundColor: "rgba(60, 57, 124, .5)",
    },
  },
  title: {
    color: theme.palette.text.secondary,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: `0px ${theme.spacing(3)}px`,
    width: 360,
    "& p": {
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",
      color: "#000",
    },
    "& img": {
      minWidth: 42,
      maxWidth: 42,
    },
  },
  btns: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    margin: "auto",
    padding: 25,
    "& button:last-child": {
      color: "#fff",
    },
  },
}));
