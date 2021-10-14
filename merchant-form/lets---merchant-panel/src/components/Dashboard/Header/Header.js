import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import useOnclickOutside from "react-cool-onclickoutside";
import storeIcon from "../../../assets/images/icon/store-icon.svg";
// import { Dropdown } from "react-bootstrap";
//Mui
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
//Mui icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/actions/userAction";

import OptionDropdown from "./OptionDropdown";
import OpenNotifications from "./OpenNotifications";

const useStyles = makeStyles((theme) => ({
  user: {
    padding: 6,
    "&:hover": {
      backgroundColor: "rgba(209, 211, 226, .8)",
      borderRadius: 999,
    },
  },
  storeImage: {
    border: "1px solid #d1d3e2",
    borderRadius: "50%",
  },
  optionStoreImage: {
    border: "1px solid #d1d3e2",
    width: 56,
    height: 56,
    marginRight: theme.spacing(1),
  },
  navbarIcons: {
    backgroundColor: "rgba(209, 211, 226, .25)",
    "&:hover": {
      backgroundColor: "#d1d3e2",
    },
  },
  hr: {
    margin: `${theme.spacing(1)}px 0px`,
  },
  optionsDropdown: {
    position: "absolute",
    padding: 0,
    borderRadius: 6,
    right: 24,
    top: 80,
    zIndex: 800,
    minWidth: 300,
    maxWidth: 300,
    [theme.breakpoints.down("md")]: {
      minWidth: 240,
      maxWidth: 240,
    },
  },
  listItem: {
    "&:hover": {
      backgroundColor: "#d1d3e2",
    },
    margin: "0px 8px",
    width: "95%",
    borderRadius: 4,
  },
  listItemProfile: {
    "& div > .MuiListItemText-primary": {
      fontWeight: 600,
    },
    "&:hover": {
      backgroundColor: "#d1d3e2",
    },
    margin: "0px 8px",
    width: "95%",
    borderRadius: 4,
  },
  active: {
    backgroundColor: "rgba(111, 182, 255, .4)",
    "&:hover": {
      backgroundColor: "rgba(111, 182, 255, .6)",
    },
  },
  notifText: {
    fontWeight: 600,
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const storeProfile = useSelector((state) => state.user.storeProfile);
  const dispacth = useDispatch();
  const history = useHistory();
  const [openOptions, setOpenOptions] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [noImg, setNoImg] = useState(false);
  const ref = useOnclickOutside(() => handleClose());

  const handleClose = () => {
    setOpenNotif(false);
    setOpenOptions(false);
  };

  const handleLogout = () => {
    dispacth(logoutUser(history));
  };

  const handleOpenNotif = () => {
    setOpenOptions(false);
    setOpenNotif(!openNotif);
  };

  const handleOpenOptions = () => {
    setOpenOptions(!openOptions);
    setOpenNotif(false);
  };

  const addDefaultSrc = (e) => {
    e.target.src = storeIcon;
    setNoImg(true);
  };

  return (
    <nav
      className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"
      ref={ref}
    >
      <ul className="navbar-nav ml-auto align-items-center">
        <li className="nav-item">
          <Link className="nav-link" to="/store">
            <div className={classes.user}>
              <span className="mr-2 d-none d-lg-inline text-gray-600 small nav-profile-email">
                {storeProfile.email}
              </span>
              {storeProfile.store_logo_file_id ? (
                <img
                  src={`https://api.lets.com.ph/2/public/files/${storeProfile?.store_logo_file_id}/`}
                  alt="Profile"
                  width="40"
                  height="40"
                  className={classes.storeImage}
                  onError={addDefaultSrc}
                  style={{
                    objectFit: noImg ? "contain" : "cover",
                    backgroundColor: noImg ? "#d1d3e2" : "transparent",
                    padding: noImg ? 4 : 0,
                  }}
                />
              ) : (
                <img
                  src={storeIcon}
                  alt="default profile"
                  className={classes.storeImage}
                  width="40"
                  height="40"
                  style={{
                    objectFit: "contain",
                    backgroundColor: "#d1d3e2",
                    padding: 6,
                  }}
                />
              )}
            </div>
          </Link>
        </li>
        <li>
          <IconButton
            style={{ margin: "0px 8px" }}
            className={`${classes.navbarIcons} ${
              openNotif ? classes.active : ""
            }`}
            onClick={handleOpenNotif}
          >
            <NotificationsIcon color="disabled" />
          </IconButton>
        </li>
        <li>
          <IconButton
            style={{ padding: 6 }}
            className={`${classes.navbarIcons} ${
              openOptions ? classes.active : ""
            }`}
            onClick={handleOpenOptions}
          >
            <ArrowDropDownIcon
              fontSize="large"
              color={openOptions ? "secondary" : "disabled"}
              style={{ position: "relative" }}
            />
          </IconButton>
          {openOptions && (
            <OptionDropdown
              classes={classes}
              store={storeProfile}
              logout={handleLogout}
              setOpenOptions={setOpenOptions}
            />
          )}
          {openNotif && <OpenNotifications classes={classes} />}
        </li>

        {/*  <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="#">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small nav-profile-email">
              {storeProfile.email}
            </span>
            <img
              className="img-profile rounded-circle"
              src={require("./../../../assets/images/profile.png")}
              alt=""
              width="48"
            />
          </Link>
        </li>
        <li className="nav-item">
          <Dropdown className="no-arrow">
            <Dropdown.Toggle variant="default" className="nav-link">
              <i className="icon icon-chat"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#">List 1</Dropdown.Item>
              <Dropdown.Item href="#">List 2</Dropdown.Item>
              <Dropdown.Item href="#">List 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>

        <li className="nav-item">
          <Dropdown className="no-arrow">
            <Dropdown.Toggle variant="default" className="nav-link">
              <span className="nav-notice">
                <i className="icon icon-bell"></i>
                <span className="nav-notice-status"></span>
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#">List 1</Dropdown.Item>
              <Dropdown.Item href="#">List 2</Dropdown.Item>
              <Dropdown.Item href="#">List 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>

        <li className="nav-item">
          <Dropdown className="no-arrow">
            <Dropdown.Toggle
              variant="default"
              className="nav-link"
              style={{ marginRight: 24 }}
            >
              <i className="icon icon-dropdown-gray"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <MuiLink color="secondary" component={Link} to="/store">
                  Store Profile
                </MuiLink>
              </Dropdown.Item>
              <Dropdown.Item>
                <MuiLink
                  color="secondary"
                  component={Link}
                  to="/product/categories"
                >
                  Categories
                </MuiLink>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                <MuiLink color="secondary" href="/login">
                  Log out
                </MuiLink>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li> */}
      </ul>
    </nav>
  );
};

export default Sidebar;
