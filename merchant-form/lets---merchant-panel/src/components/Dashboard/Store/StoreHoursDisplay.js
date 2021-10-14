import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { time12to24hours } from "../../../helpers/timeConverter";

const StoreHoursDisplay = ({ store, classes }) => {
  return (
    <Grid container>
      <Grid item md={6} xs={12}>
        <div>
          {store?.monday_store_hours_start ? (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Monday:
              </Typography>
              <div>
                <Typography variant="body1">
                  {time12to24hours(store.monday_store_hours_start)}
                </Typography>
                <span className="mx-2"> - </span>
                <Typography variant="body1">
                  {time12to24hours(store.monday_store_hours_end)}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Monday:
              </Typography>
              <Typography variant="body1">Off</Typography>
            </div>
          )}
        </div>
        <div>
          {store?.tuesday_store_hours_start ? (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Tuesday:
              </Typography>
              <div>
                <Typography variant="body1">
                  {time12to24hours(store.tuesday_store_hours_start)}
                </Typography>
                <span className="mx-2"> - </span>
                <Typography variant="body1">
                  {time12to24hours(store.tuesday_store_hours_end)}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Tuesday:
              </Typography>
              <Typography variant="body1">Off</Typography>
            </div>
          )}
        </div>
        <div>
          {store?.wednesday_store_hours_start ? (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Wednesday:
              </Typography>
              <div>
                <Typography variant="body1">
                  {time12to24hours(store.wednesday_store_hours_start)}
                </Typography>
                <span className="mx-2"> - </span>
                <Typography variant="body1">
                  {time12to24hours(store.wednesday_store_hours_end)}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Wednesday:
              </Typography>
              <Typography variant="body1">Off</Typography>
            </div>
          )}
        </div>
        <div>
          {store?.thursday_store_hours_start ? (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Thursday:
              </Typography>
              <div>
                <Typography variant="body1">
                  {time12to24hours(store.thursday_store_hours_start)}
                </Typography>
                <span className="mx-2"> - </span>
                <Typography variant="body1">
                  {time12to24hours(store.thursday_store_hours_end)}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Thursday:
              </Typography>
              <Typography variant="body1">Off</Typography>
            </div>
          )}
        </div>
      </Grid>
      <Grid item md={6} xs={12}>
        <div>
          {store?.friday_store_hours_start ? (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Friday:
              </Typography>
              <div>
                <Typography variant="body1">
                  {time12to24hours(store.friday_store_hours_start)}
                </Typography>
                <span className="mx-2"> - </span>
                <Typography variant="body1">
                  {time12to24hours(store.friday_store_hours_end)}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Friday:
              </Typography>
              <Typography variant="body1">Off</Typography>
            </div>
          )}
        </div>
        <div>
          {store?.saturday_store_hours_start ? (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Saturday:
              </Typography>
              <div>
                <Typography variant="body1">
                  {time12to24hours(store.saturday_store_hours_start)}
                </Typography>
                <span className="mx-2"> - </span>
                <Typography variant="body1">
                  {time12to24hours(store.saturday_store_hours_end)}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Saturday:
              </Typography>
              <Typography variant="body1">Off</Typography>
            </div>
          )}
        </div>
        <div>
          {store?.sunday_store_hours_start ? (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Sunday:
              </Typography>
              <div>
                <Typography variant="body1">
                  {time12to24hours(store.sunday_store_hours_start)}
                </Typography>
                <span className="mx-2"> - </span>
                <Typography variant="body1">
                  {time12to24hours(store.sunday_store_hours_end)}
                </Typography>
              </div>
            </div>
          ) : (
            <div className={classes.dayHours}>
              <Typography
                component="label"
                variant="body2"
                className={classes.hoursLabel}
                color="textSecondary"
              >
                Sunday:
              </Typography>
              <Typography variant="body1">Off</Typography>
            </div>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default StoreHoursDisplay;
