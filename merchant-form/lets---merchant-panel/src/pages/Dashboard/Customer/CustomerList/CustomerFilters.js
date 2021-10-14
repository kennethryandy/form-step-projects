import React, { useState, useEffect } from "react";
//Mui
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import RedoIcon from "@material-ui/icons/Redo";

const performanceRate = [
  "10%",
  "30%",
  "40%",
  "50%",
  "60%",
  "70%",
  "80%",
  "90%",
  "100%",
];

const CustomerFilters = ({
  classes,
  selectedStatus,
  filterStatus,
  selectedRate,
  filterPercentRate,
  resetFilters,
  customers,
  loading,
}) => {
  // const [performanceRate, setPerformanceRate] = useState([]);
  // useEffect(() => {
  //   const set = new Set(customers.map((customer) => customer.performance_rate));
  //   setPerformanceRate([...set]);
  // }, [customers]);
  return (
    <div>
      <div className="dash-box-rowborder py-4">
        <Typography variant="body1" align="center" color="textSecondary">
          Filter Search
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3">
        <Typography variant="body1" align="center" color="textSecondary">
          Status
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3 d-flex flex-column">
        <Button
          className={classes.filterBtn}
          variant={selectedStatus === "online" ? "contained" : "outlined"}
          color={selectedStatus === "online" ? "secondary" : "default"}
          onClick={() => filterStatus("online")}
          disabled={loading}
          style={{
            border:
              selectedStatus === "active"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
        >
          Online
        </Button>
        <Button
          variant={selectedStatus === "is_suspended" ? "contained" : "outlined"}
          color={selectedStatus === "is_suspended" ? "secondary" : "default"}
          style={{
            border:
              selectedStatus === "is_suspended"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
          className={classes.filterBtn}
          onClick={() => filterStatus("is_suspended")}
          disabled={loading}
        >
          Suspended
        </Button>
        <Button
          variant={selectedStatus === "is_banned" ? "contained" : "outlined"}
          color={selectedStatus === "is_banned" ? "secondary" : "default"}
          style={{
            border:
              selectedStatus === "is_banned"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
          className={classes.filterBtn}
          onClick={() => filterStatus("is_banned")}
          disabled={loading}
        >
          banned
        </Button>
      </div>
      <div className="dash-box-rowborder py-3">
        <Typography variant="body1" align="center" color="textSecondary">
          Performance Rate
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3 d-flex flex-column">
        {/* {performanceRate?.map((rate, i) => (
          <Button
            key={i}
            variant="text"
            className={`${selectedRate === rate ? "filter-active" : ""} ${
              classes.filterBtn
            }`}
            onClick={() => filterPercentRate(rate)}
          >
            <Typography
              variant="subtitle2"
              color={selectedRate === rate ? "inherit" : "textSecondary"}
            >
              {rate.split(".")[1] + " percent"}
            </Typography>
          </Button>
        ))} */}
        {performanceRate?.map((rate, i) => (
          <Button
            key={i}
            variant="text"
            className={`${selectedRate === rate ? "filter-active" : ""} ${
              classes.filterBtn
            }`}
            onClick={() => filterPercentRate(rate)}
          >
            <Typography
              variant="subtitle2"
              color={selectedRate === rate ? "inherit" : "textSecondary"}
            >
              {rate}
            </Typography>
          </Button>
        ))}
      </div>
      <div className="dash-box-rowborder py-3 d-flex align-items-center justify-content-center">
        <Button
          color="primary"
          className={classes.filterBtn}
          endIcon={<RedoIcon />}
          onClick={resetFilters}
          style={{ paddingLeft: 20 }}
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
};

export default CustomerFilters;
