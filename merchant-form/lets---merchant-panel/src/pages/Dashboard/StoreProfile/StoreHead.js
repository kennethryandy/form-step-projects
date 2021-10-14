import React from "react";
import { Link } from "react-router-dom";
import ListTopButton from "../../../components/Dashboard/Buttons/ListTopButton";
import EditIcon from "@material-ui/icons/Edit";
//Mui
import Grid from "@material-ui/core/Grid";
function StoreHead({
  type,
  is_deactivated,
  handleClick,
  isSubmitting,
  classes,
  matches,
  handleSubmit,
}) {
  const TitleHtml = () => {
    if (type === "edit") {
      return (
        <h4 className="no-margin" style={{ color: "#858796" }}>
          <Link to="/store" className="icon icon-return dash-box-return"></Link>
          Edit Profile
        </h4>
      );
    } else {
      return (
        <h4
          className="no-margin"
          className={classes.storeTitle}
          style={{ color: "#858796" }}
        >
          Store Profile
        </h4>
      );
    }
  };

  const Buttons = () => {
    if (type === "edit") {
      return (
        <div style={{ textAlign: "end" }}>
          <button
            // type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            Save and Submit
          </button>
          <Link to="/store" className="btn">
            Cancel
          </Link>
        </div>
      );
    } else {
      return (
        <div className="d-flex align-items-center justify-content-end">
          <ListTopButton
            variant="outlined"
            size="large"
            onClick={handleClick}
            color={is_deactivated ? "secondary" : "primary"}
            buttonType={is_deactivated ? "secondary" : "primary"}
            style={{ marginRight: matches ? 8 : 16 }}
          >
            {is_deactivated ? "Activate" : "Deactivate"}
          </ListTopButton>
          <ListTopButton
            endIcon={<EditIcon />}
            variant="outlined"
            size="large"
            component={Link}
            to="/store/edit"
          >
            Edit Profile
          </ListTopButton>
        </div>
      );
    }
  };

  return (
    // <div className="row v-align margin-bottom dash-box-rowhead dash-box-rowborder mx-0 mb-3 px-0">
    //   <div className="col-xs-6 col-md-6">
    //     <TitleHtml />
    //   </div>
    //   <div className="col-xs-6 col-md-6">
    //     <Buttons />
    //   </div>
    // </div>
    <Grid container className="dash-box-rowhead dash-box-rowborder px-0 mx-0" style={{zIndex: 9999}}>
      <Grid item xs={4} md={6} className="m-auto">
        <TitleHtml />
      </Grid>
      <Grid item xs={8} md={6}>
        <Buttons />
      </Grid>
    </Grid>
  );
}

export default StoreHead;
