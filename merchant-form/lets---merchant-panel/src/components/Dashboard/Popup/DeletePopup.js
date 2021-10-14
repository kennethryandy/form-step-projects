import React from "react";
//Mui
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    "& h4": {
      fontWeight: "bold",
      textAlign: "center",
    },
  },
  content: {
    margin: `${theme.spacing(3)}px 0px`,
    "& p": {
      textAlign: "center",
    },
  },
  actions: {
    "& button": {
      padding: "10px 0px",
      margin: `0px ${theme.spacing(2)}px`,
    },
  },
  dialogBackground: {
    backgroundColor: "rgba(60, 57, 124, 0.5)",
  },
}));

const DeletePopup = ({
  open,
  item,
  handleClose,
  length,
  confirmDelete,
  title,
  message,
  subtitle,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      classes={{ scrollPaper: classes.dialogBackground }}
    >
      <DialogTitle className={classes.title}>
        <Typography variant="h4">{title || "Delete"} Confirmation</Typography>
        {subtitle && (
          <Typography
            variant="body1"
            color="textSecondary"
            className="text-center"
          >
            {subtitle}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant="body1" color="textSecondary">
          {message || `Are you sure you want to delete this ${item}?`}
          {/* {message ||
            `Are you sure you want to delete all the selected ${item}? '${
              item ? length + " " + item + " selected." : ""
            }`}' */}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          fullWidth
        >
          No
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={confirmDelete}
          fullWidth
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePopup;
