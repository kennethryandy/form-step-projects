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
    margin: `${theme.spacing(2)}px 0px`,
  },
  actions: {
    flexDirection: "column",
    "& button": {
      marginLeft: "0 !important",
    },
  },
  dialogBackground: {
    backgroundColor: "rgba(60, 57, 124, 0.5)",
  },
}));

const OrderPopup = ({ open, handleClose, confirm, order }) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      classes={{ scrollPaper: classes.dialogBackground }}
    >
      <DialogTitle className={classes.title}>
        <Typography variant="h4">Proceed Order</Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          className="text-center"
        >
          Transaction Number: {order.transaction_number}
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant="body1" color="textSecondary" className="mb-3">
          Payment Summarry
        </Typography>
        <div className="d-flex justify-content-between mb-3">
          <Typography variant="body2">Subtotal:</Typography>
          <Typography variant="body2">₱{order.total_order_amount}</Typography>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <Typography variant="body2">Additional Request:</Typography>
          <Typography variant="body2">00.00</Typography>
        </div>
        <div className="d-flex justify-content-between">
          <Typography variant="body2" className="font-weight-bold">
            Total Amount
          </Typography>
          <Typography variant="body2" className="font-weight-bold">
            ₱{order.total_order_amount}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="my-2"
          onClick={confirm}
        >
          Mark as complete
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClose}
          fullWidth
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderPopup;
