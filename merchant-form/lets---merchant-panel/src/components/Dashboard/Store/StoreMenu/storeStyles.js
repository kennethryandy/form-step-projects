import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  addItems: {
    display: "flex",
    alignItems: "center",
    margin: `${theme.spacing(2)}px 0px`,
    [theme.breakpoints.only("sm")]: { flexDirection: "column" },
    "& img": {
      cursor: "pointer",
      width: "100%",
      borderRadius: 4,
    },
    "& input": {
      margin: `0px ${theme.spacing(1)}px`,
    },
  },
  addBtn: {
    backgroundColor: "#ffc001",
    color: "#fff",
    borderRadius: 10,
    marginBottom: theme.spacing(4),
    "&:hover": {
      backgroundColor: "#ffcc33",
    },
  },
  items: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "none",
    margin: `${theme.spacing(2)}px 0px`,
    "& input": {
      border: "none",
      "&:focus": {
        outline: "none",
      },
    },
    [theme.breakpoints.only("xs")]: {
      "& div": { width: "100%" },
    },
  },

  itemImageContainer: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flex: ".3",
  },

  itemIcons: {
    background: "#f4f4f8",
    borderRadius: 6,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    "& img": {
      "&:hover": { cursor: "pointer", transform: "scale(1.1)" },
      transition: `all 200ms ${theme.transitions.easing.easeInOut}`,
      borderRadius: 6,
      padding: 11,
      height: "auto",
    },
  },
  imageUpload: {
    width: "100%",
    objectFit: "cover",
    height: "auto",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.only("xs")]: { marginBottom: theme.spacing(1) },
  },
  postImage: {
    maxWidth: 60,
    minWidth: 60,
    maxHeight: 60,
    minHeight: 60,
  },
  uploadedImage: {
    maxWidth: 140,
    objectFit: "cover",
    height: "auto",
    "& img": {
      borderRadius: 10,
      border: "1.6px solid #DFE8F1",
      maxWidth: 60,
      minWidth: 60,
      maxHeight: 60,
      minHeight: 60,
    },
  },
  inputWithPeso: {
    display: "flex",
    alignItems: "center",
    border: "1.6px solid #dfe8f1",
    borderRadius: 6,
    padding: "2.5px 10px",
    background: "#f4f4f8",
    margin: `0px 16px 0px 8px`,
    width: "100%",
    "& img": {
      width: 16,
    },
    "& input": {
      padding: "5px",
      border: "none",
      fontSize: "1rem",
      fontWeight: 400,
      color: "#3c397c",
      background: "none",
      width: "100%",
      "&:focus": {
        outline: "none",
      },
      "&::placeholder": {
        color: "#3c397c",
        opacity: "0.5",
      },
    },
  },
  //Add modal
  inputWithPesoAdd: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    border: "1.6px solid #d1d3e2",
    borderRadius: 6,
    padding: "4px 6px",
    background: "#f4f4f8",
    "& img": {
      width: 16,
    },
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
  rootDialog: {
    "& .MuiBackdrop-root": {
      backgroundColor: "rgba(60, 57, 124, .5)",
    },
    "& .MuiDialogContent-root": {
      padding: 0,
    },
  },
  paperAddRoot: {
    width: "100%",
    margin: theme.spacing(2),
  },
  title: {
    padding: "0px 8px",
    "& h2": {
      fontWeight: "bold",
      fontSize: "1rem",
    },
  },
  subtitle: {
    padding: "0px 8px",
  },
  btns: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    margin: "auto",
    padding: "16px 0px",
    "& button": {
      padding: "10px",
      borderRadius: 999,
      color: "#fff",
    },
  },
}));
