import React, { forwardRef } from "react";
import pesoIcon from "../../../../assets/images/icon/peso_icon.svg";
//Mui
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
//Mui icon
import DeleteForeverIcon from "@material-ui/icons/DeleteForeverOutlined";

const EditModal = ({
  classes,
  open,
  setOpen,
  handlePreventLetterE,
  setFocus,
  focus,
  editInput,
  handleChange,
  handleRemoveItem,
  handleSave,
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  const handleSaveEdit = () => {
    handleSave();
    setOpen(false);
  };
  const handleDeleteItem = () => {
    handleRemoveItem(editInput);
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ root: classes.rootDialog, paper: classes.paperAddRoot }}
      maxWidth="xs"
      scroll="paper"
      TransitionComponent={Transition}
    >
      <div className="d-flex justify-content-between align-items-center">
        <IconButton onClick={handleClose}>
          <span className="icon icon-return"></span>
        </IconButton>
        <IconButton onClick={handleDeleteItem}>
          <DeleteForeverIcon color="primary" />
        </IconButton>
      </div>
      <DialogTitle className={classes.title}>
        Edit and Delete Product
      </DialogTitle>
      <Typography
        variant="body2"
        color="textSecondary"
        className={classes.subtitle}
      >
        Don't forget to save the changes you apply.
      </Typography>
      <DialogContent>
        <DialogContentText>
          <Paper
            elevation={2}
            style={{ padding: 8, borderRadius: 10, marginBottom: 24 }}
          >
            <label className={classes.label}>Product Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              name="item_name"
              value={editInput.item_name}
              onChange={handleChange}
              //   onKeyPress={handleKeyPress}
              style={{ padding: "8px 20px" }}
            />
          </Paper>
          <Paper elevation={2} style={{ padding: 8, borderRadius: 10 }}>
            <label className={classes.label}>Price</label>
            <div
              className={classes.inputWithPesoAdd}
              style={{ borderColor: focus ? " #4ba4ff" : "" }}
            >
              <img src={pesoIcon} alt="peso" />
              <input
                placeholder="Price"
                name="price"
                value={editInput.price}
                onChange={handleChange}
                type="number"
                onKeyDown={handlePreventLetterE}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
              />
            </div>
          </Paper>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.btns}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleSaveEdit}
          fullWidth
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default EditModal;
