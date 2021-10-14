import React, { forwardRef } from "react";
import pesoIcon from "../../../../assets/images/icon/peso_icon.svg";
import uploadIcon from "../../../../assets/images/icon/upload.svg";
//Mui
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";

//Mui icon
import CloseIcon from "@material-ui/icons/Close";
import { validateNums } from "../../../../helpers/validateNums";

const AddModal = ({
  open,
  setOpen,
  classes,
  input,
  handleChange,
  focus,
  file,
  getInputProps,
  getRootProps,
  isDragActive,
  error,
  handleSubmitItem,
  loading,
  handlePriceBlur,
  handlePriceFocus,
}) => {
  const handleClose = () => {
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
      <IconButton style={{ alignSelf: "flex-end" }} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.title}>Add Menu or Offers</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="caption" color="textSecondary" gutterBottom>
            Indicate the product name and price
          </Typography>
          <Paper
            elevation={2}
            style={{
              padding: 8,
              borderRadius: 10,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex" }}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {file ? (
                  <img
                    src={file.preview}
                    alt="Post"
                    className={classes.postImage}
                    style={{
                      opacity: isDragActive ? ".5" : 1,
                    }}
                  />
                ) : (
                  <img
                    src={uploadIcon}
                    alt=""
                    className={classes.postImage}
                    style={{
                      opacity: isDragActive ? ".5" : 1,
                    }}
                  />
                )}
              </div>
              <div style={{ marginLeft: 16 }}>
                <label htmlFor="file-input" className={classes.label}>
                  Upload Photo
                </label>
                <Typography
                  variant="caption"
                  display="block"
                  color="textSecondary"
                >
                  Browse and choose the file you want to upload.
                </Typography>
              </div>
            </div>
            <div>
              {error?.imgError && (
                <Typography variant="caption" color="error">
                  {error?.imgError}
                </Typography>
              )}
            </div>
          </Paper>
          <Paper
            elevation={2}
            style={{ padding: 8, borderRadius: 10, marginBottom: 24 }}
          >
            <label className={classes.label}>Product Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              name="item"
              value={input.item}
              onChange={handleChange}
              onBlur={handlePriceBlur}
              style={{ padding: "8px 20px" }}
              disabled={loading}
            />
            <Typography variant="caption" color="error">
              {error?.itemError}
            </Typography>
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
                value={input.price}
                onChange={handleChange}
                type="text"
                onFocus={handlePriceFocus}
                onBlur={handlePriceBlur}
                onKeyPress={validateNums}
                disabled={loading}
              />
            </div>
            <Typography variant="caption" color="error">
              {error?.priceError}
            </Typography>
          </Paper>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.btns}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleSubmitItem}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={28} /> : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default AddModal;
