import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(
  ({ children, classes, onClose, ...other }) => {
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h5" align="center" style={{ fontWeight: "bold" }}>
          {children}
        </Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  }
);

const InfoPopup = ({
  open,
  handleClose,
  title,
  content,
  update,
  submitUpdate,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs">
      <DialogTitle onClose={handleClose}>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="textSecondary" align="center">
          {content}
        </Typography>
      </DialogContent>
      <DialogActions>
        {update ? (
          <>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={handleClose}
            >
              No
            </Button>
            <Button
              fullWidth
              color="primary"
              variant="outlined"
              onClick={submitUpdate}
            >
              Yes
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleClose}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InfoPopup;
