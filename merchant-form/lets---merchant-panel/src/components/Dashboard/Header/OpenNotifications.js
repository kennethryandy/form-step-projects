import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
//Mui icons
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const OpenNotifications = ({ classes }) => {
  return (
    <Paper elevation={3} className={classes.optionsDropdown}>
      <List dense>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="h6" className={classes.notifText}>
                Notifications
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <IconButton disabled className={classes.navbarIcons} size="small">
              <MoreHorizIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" className={classes.hr} />
        <ListItem>
          <ListItemText
            secondary="No notifications"
            style={{ textAlign: "center" }}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default OpenNotifications;
