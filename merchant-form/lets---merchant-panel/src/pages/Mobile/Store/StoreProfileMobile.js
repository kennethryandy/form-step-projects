import React from "react";
import { time12to24hours } from "../../../helpers/timeConverter";
//Redux
import { useSelector } from "react-redux";
//MUI
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import useStyles from "../mobileStyles";
//Components
import StoreHoursDisplay from "../../../components/Dashboard/Store/StoreHoursDisplay";
function StoreProfileMobile({ addDefaultSrc, noImg }) {
  const classes = useStyles(noImg);
  const { storeProfile, loading } = useSelector((state) => state.user);

  return (
    <Paper elevation={0} className={classes.storeRoot}>
      {!loading && storeProfile.store_name ? (
        <>
          <div className={classes.logo}>
            <img
              src={`https://api.lets.com.ph/2/public/files/${storeProfile.store_logo_file_id}`}
              alt="Store Logo"
              onError={addDefaultSrc}
            />
          </div>
          <div>
            <div className={classes.info}>
              <Typography variant="body2">Store Name</Typography>
              <Typography variant="body1" className={classes.title}>
                {storeProfile.store_name}
              </Typography>
            </div>
            <div className={classes.info}>
              <Typography variant="body2">Store Categories</Typography>
              <Typography variant="body1">
                {storeProfile.category || "N/A"}
              </Typography>
            </div>
            <div className={classes.info}>
              <Typography variant="body2">Email Address</Typography>
              <Typography variant="body1">{storeProfile.email}</Typography>
            </div>
            <div className={classes.info}>
              <Typography variant="body2">Phone Number</Typography>
              <Typography variant="body1">
                {storeProfile.phone_number?.startsWith(9)
                  ? "+63" + storeProfile.phone_number
                  : storeProfile.phone_number}
              </Typography>
            </div>
            <div className={classes.info}>
              <Typography variant="body2">Landline Number</Typography>
              <Typography variant="body1">
                {storeProfile.landline_number
                  ? storeProfile.landline_number
                  : "N/A"}
              </Typography>
            </div>
            <div className={classes.info}>
              <Typography variant="body2">Status</Typography>
              <Typography variant="body1">
                {storeProfile.subscription_status.charAt(0).toUpperCase() +
                  storeProfile.subscription_status.slice(1)}
              </Typography>
            </div>
            <hr />
          </div>
          <div>
            <div className={classes.info}>
              {storeProfile?.monday_store_hours_start ||
              storeProfile?.tuesday_store_hours_start ||
              storeProfile?.wednesday_store_hours_start ||
              storeProfile?.thursday_store_hours_start ||
              storeProfile?.friday_store_hours_start ||
              storeProfile?.saturday_store_hours_start ||
              storeProfile?.sunday_store_hours_start ? (
                <>
                  <Typography variant="body2" className={classes.infoTitle}>
                    Opening & Closing Hours
                  </Typography>
                  <div className={classes.weeklyHours}>
                    <StoreHoursDisplay store={storeProfile} classes={classes} />
                  </div>
                </>
              ) : (
                <>
                  <Typography variant="body2" className={classes.infoTitle}>
                    Store Hours
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {time12to24hours(storeProfile?.store_hours_start)} -{" "}
                    {time12to24hours(storeProfile?.store_hours_end)}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <div>
            <div className={classes.info}>
              <Typography variant="body2">
                Store Location Full Address
              </Typography>
              <Typography variant="body1">
                {storeProfile.location_full_address}
              </Typography>
            </div>
            <div className={classes.info}>
              <Typography variant="body2">Store Description</Typography>
              <Typography variant="body1">
                {storeProfile.store_description
                  ? storeProfile.store_description
                  : "N/A"}
              </Typography>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Paper>
  );
}

export default StoreProfileMobile;
