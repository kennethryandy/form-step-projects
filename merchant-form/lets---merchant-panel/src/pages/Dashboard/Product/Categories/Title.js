import React from "react";
//Mui
import Paper from "@material-ui/core/Paper";

const Title = ({ classes }) => {
  return (
    <Paper className={classes.listTop} elevation={0}>
      <div className={classes.listTopTitle}>
        <h4 className="no-margin">Product Categories</h4>
      </div>
    </Paper>
  );
};

export default Title;
