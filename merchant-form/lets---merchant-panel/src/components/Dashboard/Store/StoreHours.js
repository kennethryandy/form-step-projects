import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import hours from "../../../helpers/hours";
import {
  convertTime12to24,
  time12to24hours,
} from "../../../helpers/timeConverter";
import useOnclickOutside from "react-cool-onclickoutside";
import WeeklyStoreHours from "./WeeklyStoreHours";
//Mui
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ArrowDownIcon from "@material-ui/icons/ExpandMore";
const StoreHours = ({
  setInfos,
  infos,
  errorTime,
  setErrorTime,
  errorDayHours,
  setErrorDayHours,
  isErrorDayHours,
  classes,
  isRequired,
  edit,
}) => {
  const storeProfile = useSelector((state) => state.user.storeProfile);
  const [showHours, setShowHours] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [isOpen, setIsOpen] = useState({
    monday: { openStart: false, openEnd: false, isCheck: false },
    tuesday: { openStart: false, openEnd: false, isCheck: false },
    wednesday: { openStart: false, openEnd: false, isCheck: false },
    thursday: { openStart: false, openEnd: false, isCheck: false },
    friday: { openStart: false, openEnd: false, isCheck: false },
    saturday: { openStart: false, openEnd: false, isCheck: false },
    sunday: { openStart: false, openEnd: false, isCheck: false },
  });
  const ref = useOnclickOutside(() => handleClose());

  useEffect(() => {
    if (
      infos.monday_store_hours_start ||
      infos.tuesday_store_hours_start ||
      infos.wednesday_store_hours_start ||
      infos.thursday_store_hours_start ||
      infos.friday_store_hours_start ||
      infos.saturday_store_hours_start ||
      infos.sunday_store_hours_start
    ) {
      setShowHours(true);
    } else {
      return;
    }
  }, [
    infos.monday_store_hours_start,
    infos.tuesday_store_hours_start,
    infos.wednesday_store_hours_start,
    infos.thursday_store_hours_start,
    infos.friday_store_hours_start,
    infos.saturday_store_hours_start,
    infos.sunday_store_hours_start,
  ]);

  const handleOpenStart = () => {
    setOpenStart(!openStart);
  };
  const handleOpenEnd = () => {
    setOpenEnd(!openEnd);
  };

  const handleClose = () => {
    setOpenEnd(false);
    setOpenStart(false);
  };

  const handleSelectItemStart = (time) => {
    if (errorTime) {
      setErrorTime((prevState) => ({
        ...prevState,
        errorTime: "",
        isError: false,
      }));
    }
    if (time === infos.store_hours_end) {
      return;
    }
    setInfos((prevState) => ({
      ...prevState,
      store_hours_start: time,
    }));
    if (openEnd) {
      setOpenEnd(false);
    } else {
      setOpenStart(false);
    }
  };

  const handleSelectItemEnd = (time) => {
    if (errorTime) {
      setErrorTime((prevState) => ({
        ...prevState,
        errorTime: "",
        isError: false,
      }));
    }
    if (time !== infos.store_hours_start) {
      setInfos((prevState) => ({
        ...prevState,
        store_hours_end: time,
      }));
    }
    setOpenEnd(false);
    setOpenStart(false);
  };

  const handleCheckboxChange = () => {
    if (infos.store_hours_start || infos.store_hours_end) {
      setInfos((prevState) => ({
        ...prevState,
        store_hours_start: !showHours
          ? ""
          : time12to24hours(storeProfile.store_hours_start),
        store_hours_end: !showHours
          ? ""
          : time12to24hours(storeProfile.store_hours_end),
      }));
    }
    if (showHours) {
      setInfos((prevState) => ({
        ...prevState,
        monday_store_hours_start: null,
        tuesday_store_hours_start: null,
        wednesday_store_hours_start: null,
        thursday_store_hours_start: null,
        friday_store_hours_start: null,
        saturday_store_hours_start: null,
        sunday_store_hours_start: null,
        monday_store_hours_end: null,
        tuesday_store_hours_end: null,
        wednesday_store_hours_end: null,
        thursday_store_hours_end: null,
        friday_store_hours_end: null,
        saturday_store_hours_end: null,
        sunday_store_hours_end: null,
      }));
      setIsOpen({
        monday: { openStart: false, openEnd: false, isCheck: false },
        tuesday: { openStart: false, openEnd: false, isCheck: false },
        wednesday: { openStart: false, openEnd: false, isCheck: false },
        thursday: { openStart: false, openEnd: false, isCheck: false },
        friday: { openStart: false, openEnd: false, isCheck: false },
        saturday: { openStart: false, openEnd: false, isCheck: false },
        sunday: { openStart: false, openEnd: false, isCheck: false },
      });
    }
    setShowHours(!showHours);
  };

  const isGreaterThanStart = (hour) => {
    if (infos.store_hours_end) {
      if (
        new Date(
          "1/1/1999 " + convertTime12to24(infos.store_hours_end) + ":00"
        ) < new Date("1/1/1999 " + convertTime12to24(hour) + ":00")
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const isGreaterThanEnd = (hour) => {
    if (infos.store_hours_start) {
      if (
        new Date(
          "1/1/1999 " + convertTime12to24(infos.store_hours_start) + ":00"
        ) > new Date("1/1/1999 " + convertTime12to24(hour) + ":00")
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      <label
        className={classes?.label}
        style={{ color: showHours ? "rgba(0, 0, 0, 0.54)" : "#000" }}
      >
        Store Hours {isRequired ? <span>*</span> : ""}
      </label>
      <div className={classes?.timeContainer}>
        <div style={{ width: "100%" }}>
          <div
            ref={ref}
            className={classes?.customDropDown}
            onClick={handleOpenStart}
          >
            <input
              name="store_hours_start"
              placeholder="Opening Hour"
              disabled="disabled"
              value={infos?.store_hours_start}
              onChange={(e) => e.preventDefault()}
              style={{
                color: showHours ? "rgba(0, 0, 0, 0.54)" : "#3c397c",
              }}
            />
            <IconButton
              onClick={handleOpenStart}
              style={{ padding: 0 }}
              disableRipple={showHours}
            >
              <ArrowDownIcon fontSize="small" />
            </IconButton>
            {openStart && !showHours && (
              <Paper square className={classes?.hourList} variant="outlined">
                <List dense>
                  {hours.map((time, i) => (
                    <ListItem
                      selected={time === infos?.store_hours_start}
                      onClick={() => handleSelectItemStart(time)}
                      button
                      dense
                      key={i}
                      disabled={isGreaterThanStart(time)}
                    >
                      <ListItemText primary={time} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </div>
        </div>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
            color: "#3c397c",
            justifyContent: "center",
            margin: "0px 24px",
          }}
        >
          -
        </span>
        <div style={{ width: "100%" }}>
          <div
            ref={ref}
            className={classes?.customDropDown}
            onClick={handleOpenEnd}
          >
            <input
              placeholder="Closing Hour"
              disabled="disabled"
              value={showHours ? "" : infos?.store_hours_end}
              onChange={(e) => e.preventDefault()}
              style={{
                color: showHours ? "rgba(0, 0, 0, 0.54)" : "#3c397c",
              }}
            />
            <IconButton
              onClick={handleOpenEnd}
              style={{ padding: 0 }}
              disableRipple={showHours}
            >
              <ArrowDownIcon fontSize="small" />
            </IconButton>
            {openEnd && !showHours && (
              <Paper square className={classes?.hourList} variant="outlined">
                <List dense>
                  {hours.map((time, i) => (
                    <ListItem
                      selected={time === infos.store_hours_end}
                      onClick={() => handleSelectItemEnd(time)}
                      button
                      dense
                      key={i}
                      disabled={isGreaterThanEnd(time)}
                    >
                      <ListItemText primary={time} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </div>
        </div>
      </div>
      <FormControlLabel
        className={classes?.hoursLabelCheckbox}
        control={
          <Checkbox
            color="secondary"
            checked={showHours}
            onClick={handleCheckboxChange}
          />
        }
        label="Input your own hours"
      />
      <WeeklyStoreHours
        showHours={showHours}
        setInfos={setInfos}
        infos={infos}
        errorTime={errorTime}
        setErrorTime={setErrorTime}
        errorDayHours={errorDayHours}
        setErrorDayHours={setErrorDayHours}
        isErrorDayHours={isErrorDayHours}
        setShowHours={setShowHours}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        edit={edit}
      />
    </>
  );
};

export default StoreHours;
