import React, { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { convertTime12to24 } from "../../../helpers/timeConverter";
import hours from "../../../helpers/hours";
//Muit
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    [theme.breakpoints.up("sm")]: { margin: `${theme.spacing(4)}px 0px` },
    [theme.breakpoints.only("xs")]: { justifyContent: "center" },
  },
  hourContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 110,
    height: 55,
    border: "1px solid",
    borderRadius: 6,
    cursor: "pointer",
  },
  hourList: {
    maxHeight: 190,
    zIndex: 999,
    width: "100%",
    position: "absolute",
    overflowY: "scroll",
    top: 55,
    padding: 0,
    borderRadius: 4,
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
  },
  listPadding: {
    paddingRight: 0,
  },
  day: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.only("xs")]: { marginRight: "auto" },
  },
  timeWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: 260,
    [theme.breakpoints.only("xs")]: { margin: `${theme.spacing(2)}px 0px` },
  },
  gridContainer: {
    marginLeft: 16,
    [theme.breakpoints.only("xs")]: { marginLeft: 0 },
  },
}));

const WeeklyStoreHours = ({
  showHours,
  setShowHours,
  setInfos,
  infos,
  setErrorTime,
  errorTime,
  errorDayHours,
  setErrorDayHours,
  isErrorDayHours,
  isOpen,
  setIsOpen,
  edit,
}) => {
  const classes = useStyles();
  const [selectedDay, setSelectedDay] = useState("");
  const ref = useOnclickOutside(() => handleClose());

  useEffect(() => {
    if (infos?.monday_store_hours_start) {
      setIsOpen((prevState) => ({
        ...prevState,
        monday: { isCheck: true },
      }));
    }
    if (infos?.tuesday_store_hours_start) {
      setIsOpen((prevState) => ({
        ...prevState,
        tuesday: { isCheck: true },
      }));
    }
    if (infos?.wednesday_store_hours_start) {
      setIsOpen((prevState) => ({
        ...prevState,
        wednesday: { isCheck: true },
      }));
    }
    if (infos?.thursday_store_hours_start) {
      setIsOpen((prevState) => ({
        ...prevState,
        thursday: { isCheck: true },
      }));
    }
    if (infos?.friday_store_hours_start) {
      setIsOpen((prevState) => ({
        ...prevState,
        friday: { isCheck: true },
      }));
    }
    if (infos?.saturday_store_hours_start) {
      setIsOpen((prevState) => ({
        ...prevState,
        saturday: { isCheck: true },
      }));
    }
    if (infos?.sunday_store_hours_start) {
      setIsOpen((prevState) => ({
        ...prevState,
        sunday: { isCheck: true },
      }));
    }
    //eslint-disable-next-line
  }, [
    infos.monday_store_hours_start,
    infos.tuesday_store_hours_start,
    infos.wednesday_store_hours_start,
    infos.thursday_store_hours_start,
    infos.friday_store_hours_start,
    infos.saturday_store_hours_start,
    infos.sunday_store_hours_start,
  ]);
  useEffect(() => {
    if (isErrorDayHours) {
      setShowHours(true);
    }
    return () => setShowHours(false);
  }, [isErrorDayHours, setShowHours]);

  const openStartDay = (day) => {
    if (errorTime) {
      setErrorTime((prevState) => ({
        ...prevState,
        errorTime: "",
        isError: false,
      }));
    }
    setSelectedDay(day);
    setIsOpen((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        openStart: prevState[day].isCheck ? !prevState[day].openStart : false,
        openEnd: false,
      },
    }));
  };

  const openEndDay = (day) => {
    if (errorTime) {
      setErrorTime((prevState) => ({
        ...prevState,
        errorTime: "",
        isError: false,
      }));
    }
    setSelectedDay(day);
    setIsOpen((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        openStart: false,
        openEnd: prevState[day].isCheck ? !prevState[day].openEnd : false,
      },
    }));
  };

  const handleCheckChange = (day) => {
    setInfos((prevState) => ({
      ...prevState,
      [`${day}_store_hours_start`]: "",
      [`${day}_store_hours_end`]: "",
    }));
    setIsOpen((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        isCheck: !prevState[day].isCheck,
      },
    }));
  };

  const handleClose = () => {
    if (selectedDay) {
      setIsOpen((prevState) => ({
        ...prevState,
        [selectedDay]: {
          ...prevState[selectedDay],
          openStart: false,
          openEnd: false,
        },
      }));
    } else {
      return;
    }
  };
  return (
    <Collapse in={showHours}>
      <Grid container spacing={edit ? 5 : 0}>
        {edit ? (
          <>
            <Grid item md={5} xs={12}>
              <div className={classes.wrapper}>
                <div className={classes.day}>
                  <Checkbox
                    color="secondary"
                    checked={isOpen.monday?.isCheck}
                    onClick={() => handleCheckChange("monday")}
                  />
                  <Typography variant="body1" color="secondary">
                    Monday
                  </Typography>
                </div>
                <div className={classes.timeWrapper}>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.mondayStart
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.mondayStart
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openStartDay("monday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Opening Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.monday_store_hours_start}
                    </Typography>
                    {isOpen.monday?.openStart && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="end"
                        errorDayHours={errorDayHours?.mondayStart}
                        errorType="mondayStart"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setIsOpen={setIsOpen}
                        setInfos={setInfos}
                        day="monday"
                        i="start"
                      />
                    )}
                  </div>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.mondayEnd ? "red" : "#d1d3e2",
                      backgroundColor: errorDayHours?.mondayEnd
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openEndDay("monday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Closing Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.monday_store_hours_end}
                    </Typography>
                    {isOpen.monday?.openEnd && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="start"
                        errorDayHours={errorDayHours?.mondayEnd}
                        errorType="mondayEnd"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        i="end"
                        day="monday"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className={classes.wrapper}>
                <div className={classes.day}>
                  <Checkbox
                    color="secondary"
                    checked={isOpen.tuesday?.isCheck}
                    onClick={() => handleCheckChange("tuesday")}
                  />
                  <Typography variant="body1" color="secondary">
                    Tuesday
                  </Typography>
                </div>
                <div className={classes.timeWrapper}>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.tuesdayStart
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.tuesdayStart
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openStartDay("tuesday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Opening Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.tuesday_store_hours_start}
                    </Typography>
                    {isOpen.tuesday?.openStart && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="end"
                        errorDayHours={errorDayHours?.tuesdayStart}
                        errorType="tuesdayStart"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        i="start"
                        day="tuesday"
                      />
                    )}
                  </div>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.tuesdayEnd
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.tuesdayEnd
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openEndDay("tuesday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Closing Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.tuesday_store_hours_end}
                    </Typography>
                    {isOpen.tuesday?.openEnd && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="start"
                        errorDayHours={errorDayHours?.tuesdayEnd}
                        errorType="tuesdayEnd"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="tuesday"
                        i="end"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className={classes.wrapper}>
                <div className={classes.day}>
                  <Checkbox
                    color="secondary"
                    checked={isOpen.wednesday?.isCheck}
                    onClick={() => handleCheckChange("wednesday")}
                  />
                  <Typography variant="body1" color="secondary">
                    Wednesday
                  </Typography>
                </div>
                <div className={classes.timeWrapper}>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.wednesdayStart
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.wednesdayStart
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openStartDay("wednesday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Opening Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.wednesday_store_hours_start}
                    </Typography>
                    {isOpen.wednesday?.openStart && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="end"
                        errorDayHours={errorDayHours?.wednesdayStart}
                        errorType="wednesdayStart"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="wednesday"
                        i="start"
                      />
                    )}
                  </div>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.wednesdayEnd
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.wednesdayEnd
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openEndDay("wednesday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Closing Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.wednesday_store_hours_end}
                    </Typography>
                    {isOpen.wednesday?.openEnd && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="start"
                        errorDayHours={errorDayHours?.wednesdayEnd}
                        errorType="wednesdayEnd"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="wednesday"
                        i="end"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className={classes.wrapper}>
                <div className={classes.day}>
                  <Checkbox
                    color="secondary"
                    checked={isOpen.thursday?.isCheck}
                    onClick={() => handleCheckChange("thursday")}
                  />
                  <Typography variant="body1" color="secondary">
                    Thursday
                  </Typography>
                </div>
                <div className={classes.timeWrapper}>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.thursdayStart
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.thursdayStart
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openStartDay("thursday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Opening Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.thursday_store_hours_start}
                    </Typography>
                    {isOpen.thursday?.openStart && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="end"
                        errorDayHours={errorDayHours?.thursdayStart}
                        errorType="thursdayStart"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="thursday"
                        i="start"
                      />
                    )}
                  </div>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.thursdayEnd
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.thursdayEnd
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openEndDay("thursday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Closing Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.thursday_store_hours_end}
                    </Typography>
                    {isOpen.thursday?.openEnd && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="start"
                        errorDayHours={errorDayHours?.thursdayEnd}
                        errorType="thursdayEnd"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="thursday"
                        i="end"
                      />
                    )}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item md={5} xs={12}>
              <div className={classes.wrapper}>
                <div className={classes.day}>
                  <Checkbox
                    color="secondary"
                    checked={isOpen.friday?.isCheck}
                    onClick={() => handleCheckChange("friday")}
                  />
                  <Typography variant="body1" color="secondary">
                    Friday
                  </Typography>
                </div>
                <div className={classes.timeWrapper}>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.fridayStart
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.fridayStart
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openStartDay("friday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Opening Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.friday_store_hours_start}
                    </Typography>
                    {isOpen.friday?.openStart && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="end"
                        errorDayHours={errorDayHours?.fridayStart}
                        errorType="fridayStart"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="friday"
                        i="start"
                      />
                    )}
                  </div>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.fridayEnd ? "red" : "#d1d3e2",
                      backgroundColor: errorDayHours?.fridayEnd
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openEndDay("friday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Closing Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.friday_store_hours_end}
                    </Typography>
                    {isOpen.friday?.openEnd && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="start"
                        errorDayHours={errorDayHours?.fridayEnd}
                        errorType="fridayEnd"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="friday"
                        i="end"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className={classes.wrapper}>
                <div className={classes.day}>
                  <Checkbox
                    color="secondary"
                    checked={isOpen.saturday?.isCheck}
                    onClick={() => handleCheckChange("saturday")}
                  />
                  <Typography variant="body1" color="secondary">
                    Saturday
                  </Typography>
                </div>
                <div className={classes.timeWrapper}>
                  <div
                    className={classes.hourContainer}
                    style={{
                      marginRight: 16,
                      borderColor: errorDayHours?.saturdayStart
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.saturdayStart
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openStartDay("saturday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Opening Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.saturday_store_hours_start}
                    </Typography>
                    {isOpen.saturday?.openStart && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="end"
                        errorDayHours={errorDayHours?.saturdayStart}
                        errorType="saturdayStart"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="saturday"
                        i="start"
                      />
                    )}
                  </div>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.saturdayEnd
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.saturdayEnd
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openEndDay("saturday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Closing Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.saturday_store_hours_end}
                    </Typography>
                    {isOpen.saturday?.openEnd && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="start"
                        errorDayHours={errorDayHours?.saturdayEnd}
                        errorType="saturdayEnd"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="saturday"
                        i="end"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className={classes.wrapper}>
                <div className={classes.day}>
                  <Checkbox
                    color="secondary"
                    checked={isOpen.sunday?.isCheck}
                    onClick={() => handleCheckChange("sunday")}
                  />
                  <Typography variant="body1" color="secondary">
                    Sunday
                  </Typography>
                </div>
                <div className={classes.timeWrapper}>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.sundayStart
                        ? "red"
                        : "#d1d3e2",
                      backgroundColor: errorDayHours?.sundayStart
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openStartDay("sunday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Opening Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.sunday_store_hours_start}
                    </Typography>
                    {isOpen.sunday?.openStart && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="end"
                        errorDayHours={errorDayHours?.sundayStart}
                        errorType="sundayStart"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="sunday"
                        i="start"
                      />
                    )}
                  </div>
                  <div
                    className={classes.hourContainer}
                    style={{
                      borderColor: errorDayHours?.sundayEnd ? "red" : "#d1d3e2",
                      backgroundColor: errorDayHours?.sundayEnd
                        ? "rgba(244,68,79,0.2)"
                        : "#f4f4f8",
                    }}
                    onClick={() => openEndDay("sunday")}
                    ref={ref}
                  >
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      Closing Hour
                    </Typography>
                    <Typography variant="body2">
                      {infos?.sunday_store_hours_end}
                    </Typography>
                    {isOpen.sunday?.openEnd && (
                      <HourList
                        classes={classes}
                        infos={infos}
                        j="start"
                        errorDayHours={errorDayHours?.sundayEnd}
                        errorType="sundayEnd"
                        setErrorDayHours={setErrorDayHours}
                        setErrorTime={setErrorTime}
                        setInfos={setInfos}
                        setIsOpen={setIsOpen}
                        day="sunday"
                        i="end"
                      />
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          </>
        ) : (
          <Grid item md={12} xs={12}>
            <div className={classes.wrapper}>
              <div className={classes.day}>
                <Checkbox
                  color="secondary"
                  checked={isOpen.monday?.isCheck}
                  onClick={() => handleCheckChange("monday")}
                />
                <Typography variant="body1" color="secondary">
                  Monday
                </Typography>
              </div>
              <div className={classes.timeWrapper}>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.mondayStart ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.mondayStart
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openStartDay("monday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Opening Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.monday_store_hours_start}
                  </Typography>
                  {isOpen.monday?.openStart && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="end"
                      errorDayHours={errorDayHours?.mondayStart}
                      errorType="mondayStart"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setIsOpen={setIsOpen}
                      setInfos={setInfos}
                      day="monday"
                      i="start"
                    />
                  )}
                </div>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.mondayEnd ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.mondayEnd
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openEndDay("monday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Closing Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.monday_store_hours_end}
                  </Typography>
                  {isOpen.monday?.openEnd && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="start"
                      errorDayHours={errorDayHours?.mondayEnd}
                      errorType="mondayEnd"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      i="end"
                      day="monday"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className={classes.wrapper}>
              <div className={classes.day}>
                <Checkbox
                  color="secondary"
                  checked={isOpen.tuesday?.isCheck}
                  onClick={() => handleCheckChange("tuesday")}
                />
                <Typography variant="body1" color="secondary">
                  Tuesday
                </Typography>
              </div>
              <div className={classes.timeWrapper}>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.tuesdayStart
                      ? "red"
                      : "#d1d3e2",
                    backgroundColor: errorDayHours?.tuesdayStart
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openStartDay("tuesday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Opening Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.tuesday_store_hours_start}
                  </Typography>
                  {isOpen.tuesday?.openStart && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="end"
                      errorDayHours={errorDayHours?.tuesdayStart}
                      errorType="tuesdayStart"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      i="start"
                      day="tuesday"
                    />
                  )}
                </div>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.tuesdayEnd ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.tuesdayEnd
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openEndDay("tuesday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Closing Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.tuesday_store_hours_end}
                  </Typography>
                  {isOpen.tuesday?.openEnd && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="start"
                      errorDayHours={errorDayHours?.tuesdayEnd}
                      errorType="tuesdayEnd"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="tuesday"
                      i="end"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className={classes.wrapper}>
              <div className={classes.day}>
                <Checkbox
                  color="secondary"
                  checked={isOpen.wednesday?.isCheck}
                  onClick={() => handleCheckChange("wednesday")}
                />
                <Typography variant="body1" color="secondary">
                  Wednesday
                </Typography>
              </div>
              <div className={classes.timeWrapper}>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.wednesdayStart
                      ? "red"
                      : "#d1d3e2",
                    backgroundColor: errorDayHours?.wednesdayStart
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openStartDay("wednesday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Opening Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.wednesday_store_hours_start}
                  </Typography>
                  {isOpen.wednesday?.openStart && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="end"
                      errorDayHours={errorDayHours?.wednesdayStart}
                      errorType="wednesdayStart"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="wednesday"
                      i="start"
                    />
                  )}
                </div>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.wednesdayEnd
                      ? "red"
                      : "#d1d3e2",
                    backgroundColor: errorDayHours?.wednesdayEnd
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openEndDay("wednesday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Closing Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.wednesday_store_hours_end}
                  </Typography>
                  {isOpen.wednesday?.openEnd && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="start"
                      errorDayHours={errorDayHours?.wednesdayEnd}
                      errorType="wednesdayEnd"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="wednesday"
                      i="end"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className={classes.wrapper}>
              <div className={classes.day}>
                <Checkbox
                  color="secondary"
                  checked={isOpen.thursday?.isCheck}
                  onClick={() => handleCheckChange("thursday")}
                />
                <Typography variant="body1" color="secondary">
                  Thursday
                </Typography>
              </div>
              <div className={classes.timeWrapper}>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.thursdayStart
                      ? "red"
                      : "#d1d3e2",
                    backgroundColor: errorDayHours?.thursdayStart
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openStartDay("thursday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Opening Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.thursday_store_hours_start}
                  </Typography>
                  {isOpen.thursday?.openStart && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="end"
                      errorDayHours={errorDayHours?.thursdayStart}
                      errorType="thursdayStart"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="thursday"
                      i="start"
                    />
                  )}
                </div>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.thursdayEnd ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.thursdayEnd
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openEndDay("thursday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Closing Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.thursday_store_hours_end}
                  </Typography>
                  {isOpen.thursday?.openEnd && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="start"
                      errorDayHours={errorDayHours?.thursdayEnd}
                      errorType="thursdayEnd"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="thursday"
                      i="end"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={classes.wrapper}>
              <div className={classes.day}>
                <Checkbox
                  color="secondary"
                  checked={isOpen.friday?.isCheck}
                  onClick={() => handleCheckChange("friday")}
                />
                <Typography variant="body1" color="secondary">
                  Friday
                </Typography>
              </div>
              <div className={classes.timeWrapper}>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.fridayStart ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.fridayStart
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openStartDay("friday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Opening Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.friday_store_hours_start}
                  </Typography>
                  {isOpen.friday?.openStart && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="end"
                      errorDayHours={errorDayHours?.fridayStart}
                      errorType="fridayStart"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="friday"
                      i="start"
                    />
                  )}
                </div>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.fridayEnd ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.fridayEnd
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openEndDay("friday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Closing Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.friday_store_hours_end}
                  </Typography>
                  {isOpen.friday?.openEnd && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="start"
                      errorDayHours={errorDayHours?.fridayEnd}
                      errorType="fridayEnd"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="friday"
                      i="end"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className={classes.wrapper}>
              <div className={classes.day}>
                <Checkbox
                  color="secondary"
                  checked={isOpen.saturday?.isCheck}
                  onClick={() => handleCheckChange("saturday")}
                />
                <Typography variant="body1" color="secondary">
                  Saturday
                </Typography>
              </div>
              <div className={classes.timeWrapper}>
                <div
                  className={classes.hourContainer}
                  style={{
                    marginRight: 16,
                    borderColor: errorDayHours?.saturdayStart
                      ? "red"
                      : "#d1d3e2",
                    backgroundColor: errorDayHours?.saturdayStart
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openStartDay("saturday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Opening Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.saturday_store_hours_start}
                  </Typography>
                  {isOpen.saturday?.openStart && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="end"
                      errorDayHours={errorDayHours?.saturdayStart}
                      errorType="saturdayStart"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="saturday"
                      i="start"
                    />
                  )}
                </div>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.saturdayEnd ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.saturdayEnd
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openEndDay("saturday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Closing Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.saturday_store_hours_end}
                  </Typography>
                  {isOpen.saturday?.openEnd && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="start"
                      errorDayHours={errorDayHours?.saturdayEnd}
                      errorType="saturdayEnd"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="saturday"
                      i="end"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className={classes.wrapper}>
              <div className={classes.day}>
                <Checkbox
                  color="secondary"
                  checked={isOpen.sunday?.isCheck}
                  onClick={() => handleCheckChange("sunday")}
                />
                <Typography variant="body1" color="secondary">
                  Sunday
                </Typography>
              </div>
              <div className={classes.timeWrapper}>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.sundayStart ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.sundayStart
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openStartDay("sunday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Opening Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.sunday_store_hours_start}
                  </Typography>
                  {isOpen.sunday?.openStart && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="end"
                      errorDayHours={errorDayHours?.sundayStart}
                      errorType="sundayStart"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="sunday"
                      i="start"
                    />
                  )}
                </div>
                <div
                  className={classes.hourContainer}
                  style={{
                    borderColor: errorDayHours?.sundayEnd ? "red" : "#d1d3e2",
                    backgroundColor: errorDayHours?.sundayEnd
                      ? "rgba(244,68,79,0.2)"
                      : "#f4f4f8",
                  }}
                  onClick={() => openEndDay("sunday")}
                  ref={ref}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    variant="body2"
                    color="textSecondary"
                  >
                    Closing Hour
                  </Typography>
                  <Typography variant="body2">
                    {infos?.sunday_store_hours_end}
                  </Typography>
                  {isOpen.sunday?.openEnd && (
                    <HourList
                      classes={classes}
                      infos={infos}
                      j="start"
                      errorDayHours={errorDayHours?.sundayEnd}
                      errorType="sundayEnd"
                      setErrorDayHours={setErrorDayHours}
                      setErrorTime={setErrorTime}
                      setInfos={setInfos}
                      setIsOpen={setIsOpen}
                      day="sunday"
                      i="end"
                    />
                  )}
                </div>
              </div>
            </div>
          </Grid>
        )}
      </Grid>
    </Collapse>
  );
};

const HourList = ({
  setInfos,
  setIsOpen,
  day,
  i,
  j,
  setErrorTime,
  errorType,
  setErrorDayHours,
  errorDayHours,
  infos,
  classes,
}) => {
  const handleSelectTime = (hour) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [errorType]: false,
      },
    }));
    if (
      infos[`${day}_store_hours_${j}`] !== hour ||
      infos[`${day}_store_hours_${i}`] !== hour
    ) {
      if (errorDayHours) {
        setErrorTime((prevState) => ({
          ...prevState,
          errorTime: "",
          isError: false,
        }));
        setErrorDayHours((prevState) => ({ ...prevState, [errorType]: false }));
      }
      setInfos((prevState) => ({
        ...prevState,
        [`${day}_store_hours_${i}`]: hour,
      }));
    }
  };
  const isGreaterThan = (hour) => {
    if (infos[`${day}_store_hours_${j}`] === hour) {
      return true;
    }
    if (infos[`${day}_store_hours_${j}`]) {
      if (
        i === "end" &&
        new Date(
          "1/1/1999 " +
            convertTime12to24(infos[`${day}_store_hours_${j}`]) +
            ":00"
        ) > new Date("1/1/1999 " + convertTime12to24(hour) + ":00")
      ) {
        return true;
      } else if (
        i === "start" &&
        new Date(
          "1/1/1999 " +
            convertTime12to24(infos[`${day}_store_hours_${j}`]) +
            ":00"
        ) < new Date("1/1/1999 " + convertTime12to24(hour) + ":00")
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };
  return (
    <Paper elevation={3} className={classes.hourList}>
      <List dense>
        {hours.map((hour, i) => (
          <div key={i}>
            <ListItem
              classes={{ gutters: classes.listPadding }}
              button
              onClick={() => handleSelectTime(hour)}
              disabled={isGreaterThan(hour)}
            >
              <ListItemText primary={hour} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default WeeklyStoreHours;
