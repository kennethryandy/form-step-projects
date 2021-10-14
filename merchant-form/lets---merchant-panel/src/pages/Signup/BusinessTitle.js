import React from "react";
import Typography from "@material-ui/core/Typography";
import lets from "../../assets/images/icon/lets-sign-in.svg";
import Hidden from "@material-ui/core/Hidden";

const BusinessTitle = ({ classes }) => {
  return (
    <div className={classes.signupHeaderWrapper}>
      <Hidden smUp>
        <img src={lets} alt="Lets" />
      </Hidden>
      <div className={classes.businessTitle}>
        <h1 className="text-uppercase mb-2 no-margin color-black">
          <strong>Business Details</strong>
        </h1>
        <Typography variant="body1" color="textSecondary">
          Enter your business details to get started
        </Typography>
      </div>
    </div>
  );
};

export default BusinessTitle;
