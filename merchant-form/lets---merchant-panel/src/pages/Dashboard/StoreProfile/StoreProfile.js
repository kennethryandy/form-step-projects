import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import storeIcon from "../../../assets/images/icon/store-icon.svg";
// import Flatpickr from "react-flatpickr";
// import dayjs from 'dayjs'
//Redux
import { useSelector, useDispatch } from "react-redux";
import { editStore } from "../../../redux/actions/userAction";
//Mui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useStyles from "./storeStyle";
//Components
import Popup from "./../../../components/Dashboard/Popup";
import StoreHead from "./StoreHead";
import { time12to24hours } from "../../../helpers/timeConverter";
import StoreProfileSkeleton from "../../../components/Skeleton/StoreProfileSkeleton";
import StoreHoursDisplay from "../../../components/Dashboard/Store/StoreHoursDisplay";
import StoreProfileMobile from "../../Mobile/Store/StoreProfileMobile";
import CustomSnackbar from "../../../components/Dashboard/Snackbar/CustomSnackbar";

const StoreProfile = ({ type }) => {
  const [modal, setModal] = useState(false);
  const [storeDetails, setStoreDetails] = useState({});
  const { storeProfile, loading, showSnackbar } = useSelector(
    (state) => state.user
  );
  const [noImg, setNoImg] = useState(false);
  const classes = useStyles({ noImg });
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  // const options = {
  //   enableTime: true,
  //   noCalendar: true,
  //   dateFormat: "H:i",
  //   time_24hr: true,
  // };
  useEffect(() => {
    if (!loading) {
      setStoreDetails(storeProfile);
    }
  }, [storeProfile, loading]);
  const handleClick = () => {
    setModal(!modal);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editStore(storeDetails, history));
  };

  const addDefaultSrc = (e) => {
    e.target.src = storeIcon;
    setNoImg(true);
  };
  return (
    <>
      <Paper elevation={0} className={classes.root}>
        <StoreHead
          type={type}
          is_deactivated={storeDetails?.is_deactivated}
          handleClick={handleClick}
          handleSubmit={handleSubmit}
          classes={classes}
          matches={matches}
        />
        {matches ? (
          <StoreProfileMobile addDefaultSrc={addDefaultSrc} noImg={noImg} />
        ) : !loading && storeProfile.store_name ? (
          <>
            <Grid container className={classes.gridContainer} spacing={4}>
              <Grid item md={4} className="pb-0 mb-0 position-relative">
                <img
                  src={`https://api.lets.com.ph/2/public/files/${storeProfile.store_logo_file_id}`}
                  alt="Store Logo"
                  className={classes.storeLogo}
                  onError={addDefaultSrc}
                />
              </Grid>
              <Grid item md={4} className="dash-box pb-0 position-relative">
                <div className={classes.infos}>
                  <Typography
                    component="label"
                    variant="body2"
                    color="textSecondary"
                    className={classes.infoLabel}
                  >
                    Store Name
                  </Typography>
                  <Typography variant="body1" className={classes.title}>
                    {storeProfile.store_name}
                  </Typography>
                </div>
                <div className={classes.infos}>
                  <Typography
                    component="label"
                    variant="body2"
                    color="textSecondary"
                    className={classes.infoLabel}
                  >
                    Store Category
                  </Typography>
                  <Typography variant="body1">
                    {storeProfile.category ? storeProfile.category : "N/A"}
                  </Typography>
                </div>
                <div className={classes.infos}>
                  <Typography
                    component="label"
                    variant="body2"
                    color="textSecondary"
                    className={classes.infoLabel}
                  >
                    Email Address
                  </Typography>
                  <Typography variant="body1">{storeProfile.email}</Typography>
                </div>
              </Grid>
              <Grid item md={4} className="dash-box pb-0 position-relative">
                <div className={classes.infos}>
                  <Typography
                    component="label"
                    variant="body2"
                    color="textSecondary"
                    className={classes.infoLabel}
                  >
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {storeProfile.phone_number?.startsWith(9)
                      ? "+63" + storeProfile.phone_number
                      : storeProfile.phone_number}
                  </Typography>
                </div>
                <div className={classes.infos}>
                  <Typography
                    component="label"
                    variant="body2"
                    color="textSecondary"
                    className={classes.infoLabel}
                  >
                    Landline Number
                  </Typography>
                  {storeProfile.landline_number ? (
                    <Typography variant="body1">
                      {storeProfile.landline_number}
                    </Typography>
                  ) : (
                    <Typography variant="body1">N/A</Typography>
                  )}
                </div>
                <div className={classes.infos}>
                  <Typography
                    component="label"
                    variant="body2"
                    color="textSecondary"
                    className={classes.infoLabel}
                  >
                    Status
                  </Typography>
                  <Typography variant="body1" className="text-capitalize">
                    {storeProfile.subscription_status}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={4} className={classes.gridContainer}>
              <Grid item md={4}></Grid>
              <Grid item md={8} className="dash-box position-relative">
                <hr className={classes.divider} style={{ top: 0 }} />
                <div className={classes.infos}>
                  {storeProfile?.monday_store_hours_start ||
                  storeProfile?.tuesday_store_hours_start ||
                  storeProfile?.wednesday_store_hours_start ||
                  storeProfile?.thursday_store_hours_start ||
                  storeProfile?.friday_store_hours_start ||
                  storeProfile?.saturday_store_hours_start ||
                  storeProfile?.sunday_store_hours_start ? (
                    <>
                      <Typography
                        component="label"
                        variant="body2"
                        color="textSecondary"
                        className={classes.infoLabel}
                      >
                        Opening & Closing Hours
                      </Typography>
                      <div className={classes.weeklyHours}>
                        <StoreHoursDisplay
                          store={storeProfile}
                          classes={classes}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Typography
                        component="label"
                        variant="body2"
                        color="textSecondary"
                        className={classes.infoLabel}
                      >
                        Store Hours
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {time12to24hours(storeProfile?.store_hours_start)} -{" "}
                        {time12to24hours(storeProfile?.store_hours_end)}
                      </Typography>
                    </>
                  )}
                </div>
                <hr className={classes.divider} />
              </Grid>
            </Grid>
            <Grid container spacing={4} className={classes.gridContainer}>
              <Grid item md={4}></Grid>
              <Grid item md={8} className="dash-box">
                <div className={classes.infos}>
                  <Typography
                    component="label"
                    variant="body2"
                    color="textSecondary"
                    className={classes.infoLabel}
                  >
                    Store Location Full Address
                  </Typography>
                  <Typography variant="body1">
                    {storeProfile.location_full_address}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={4}
              className={classes.gridContainer}
              style={{ marginBottom: 32 }}
            >
              <Grid item md={4}></Grid>
              <Grid item md={8} className="dash-box">
                <div className={classes.infos}>
                  <Typography
                    component="label"
                    variant="body2"
                    color="textSecondary"
                    className={classes.infoLabel}
                  >
                    Store Description
                  </Typography>
                  {storeProfile.store_description ? (
                    <Typography variant="body1">
                      {storeProfile.store_description}
                    </Typography>
                  ) : (
                    <Typography variant="body1">N/A</Typography>
                  )}
                </div>
              </Grid>
            </Grid>
          </>
        ) : (
          <StoreProfileSkeleton />
        )}
      </Paper>
      <Popup
        modal={modal}
        handleClose={closeModal}
        is_deactivated={storeDetails?.is_deactivated}
      />
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={1800}
        onClose={() => dispatch({ type: "HIDE_SNACKBAR" })}
        type="edit"
        message="Changes have been saved successfully!"
      />
    </>
  );
};

export default StoreProfile;
