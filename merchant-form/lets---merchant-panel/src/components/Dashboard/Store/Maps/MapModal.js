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

const MapModal = ({
  isEstablishment,
  setIsEstablishment,
  setNewValue,
  setInfos,
  classes,
}) => {
  const handleClose = () => {
    setIsEstablishment({ open: false });
    setNewValue("");
  };

  const handleConfirm = () => {
    const { details, location } = isEstablishment;
    setNewValue(location);
    let opening_hours = {};
    if (details.opening_hours?.weekday_text) {
      const { weekday_text } = details.opening_hours;
      weekday_text.map((day) => {
        const dayArr = day.split(" ");
        const newDay = dayArr[0].slice(0, -1);
        if (dayArr[1] !== "Closed" && dayArr[1] !== "Open") {
          return (opening_hours = {
            ...opening_hours,
            [`${newDay.toLowerCase()}_store_hours_start`]:
              dayArr[1] + " " + dayArr[2],
            [`${newDay.toLowerCase()}_store_hours_end`]:
              dayArr[dayArr.length - 2] + " " + dayArr[dayArr.length - 1],
          });
        } else {
          return (opening_hours = { ...opening_hours });
        }
      });
    }
    let phone_number = details?.international_phone_number
      ? details?.international_phone_number?.replace(/[^0-9]+/g, "")
      : "";
    if (phone_number && phone_number.startsWith("639")) {
      phone_number = phone_number.split("63")[1];
    }
    setInfos((prevState) => ({
      ...prevState,
      ...opening_hours,
      store_name: details?.name,
      place_id: details?.place_id,
      landline_number:
        details?.formatted_phone_number &&
        details?.formatted_phone_number.startsWith("(")
          ? details?.formatted_phone_number
          : prevState.landline_number,
      phone_number,
      location_full_address: details?.formatted_address
        ? details?.formatted_address
        : prevState.location_full_address,
    }));
    setIsEstablishment({ open: false });
  };

  return (
    <Dialog
      open={isEstablishment.open}
      onClose={handleClose}
      classes={{ root: classes.rootDialog, paper: classes.paperRoot }}
      maxWidth="sm"
    >
      <IconButton style={{ alignSelf: "flex-end" }} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.title}>Are you this?</DialogTitle>
      <DialogContent className={classes.content}>
        <DialogContentText>{isEstablishment.place_name}</DialogContentText>
        <img src={isEstablishment.icon} alt="" />
      </DialogContent>
      <DialogActions className={classes.btns}>
        <Button size="large" onClick={handleClose} fullWidth>
          No
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={handleConfirm}
          color="secondary"
          fullWidth
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapModal;
