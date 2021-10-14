import React from "react";
import { useHistory } from "react-router-dom";
import storeIcon from "../../../assets/images/icon/store-icon.svg";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
//Mui icons
import ListIcon from "@material-ui/icons/FormatListBulleted";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const OptionDropdown = ({ classes, store, logout, setOpenOptions }) => {
  const history = useHistory();

  return (
    <Paper elevation={3} className={classes.optionsDropdown}>
      <List dense>
        {store.store_name && (
          <ListItem
            button
            className={classes.listItemProfile}
            onClick={() => history.push("/store")}
          >
            <ListItemAvatar>
              {store?.store_logo_file_id ? (
                <Avatar
                  src={`https://api.lets.com.ph/2/public/files/${store.store_logo_file_id}/`}
                  className={classes.optionStoreImage}
                >
                  <img
                    src={storeIcon}
                    style={{ width: "65%" }}
                    alt="default profile"
                  />
                </Avatar>
              ) : (
                <Avatar
                  src={storeIcon}
                  className={classes.optionStoreImage}
                  style={{
                    objectFit: "contain",
                    backgroundColor: "#d1d3e2",
                    padding: 12,
                  }}
                />
              )}
            </ListItemAvatar>
            <ListItemText primary={store.store_name} secondary="View profile" />
          </ListItem>
        )}
        <Divider variant="inset" component="li" className={classes.hr} />
        <ListItem
          button
          className={classes.listItem}
          onClick={() => {
            history.push("/store/edit");
            setOpenOptions(false);
          }}
        >
          <ListItemIcon>
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
          </ListItemIcon>
          <ListItemText primary="Edit Store Profile" />
        </ListItem>
        <ListItem
          button
          className={classes.listItem}
          onClick={() => {
            history.push("/product/categories");
            setOpenOptions(false);
          }}
        >
          <ListItemIcon>
            <IconButton size="small">
              <ListIcon />
            </IconButton>
          </ListItemIcon>
          <ListItemText primary="Product Categories" />
        </ListItem>
        <ListItem button className={classes.listItem} onClick={logout}>
          <ListItemIcon>
            <IconButton size="small">
              <ExitToAppIcon />
            </IconButton>
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
    </Paper>
  );
};

export default OptionDropdown;
