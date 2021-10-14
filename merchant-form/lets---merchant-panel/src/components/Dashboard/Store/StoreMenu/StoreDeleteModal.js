import React from "react";
//Mui
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
//Mui icon
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  rootDialog: {
    "& .MuiBackdrop-root": {
      backgroundColor: "rgba(60, 57, 124, .5)",
    },
  },
  paperRoot: {
    borderRadius: 10,
    minWidth: 460,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  title: {
    padding: "0px 24px",
    "& h2": {
      fontWeight: "bold",
      fontSize: "2rem",
    },
  },
  btns: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    margin: "auto",
    padding: 25,
    "& button": {
      padding: "16px",
      borderRadius: 10,
    },
    "& button:last-child": {
      padding: "16px",
      color: "#000",
      borderRadius: 10,
    },
  },
}));

const StoreDeleteModal = ({
  deleteModal,
  setDeleteModal,
  handleRemoveItem,
  open,
  setOpen,
}) => {
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
    setDeleteModal({ created_at: "", name: "", imgId: "" });
  };

  const handleConfirm = () => {
    setOpen(false);
    handleRemoveItem(deleteModal);
    setDeleteModal({ created_at: "", name: "", imgId: "" });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ root: classes.rootDialog, paper: classes.paperRoot }}
      maxWidth="sm"
    >
      <IconButton style={{ alignSelf: "flex-end" }} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.title}>Delete Product?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this product "{deleteModal.name}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.btns}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          fullWidth
        >
          Delete
        </Button>
        <Button size="large" onClick={handleClose} fullWidth>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreDeleteModal;
