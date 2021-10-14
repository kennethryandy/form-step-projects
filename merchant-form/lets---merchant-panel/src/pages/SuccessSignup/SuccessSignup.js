import React from "react";
import successLogo from "../../assets/images/success_logo.png";
import { Link } from "react-router-dom";
//Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  bannerText: {
    maxWidth: 440,
    textAlign: "justify",
    [theme.breakpoints.down("sm")]: {
      margin: "50px 0px",
    },
    "& h1": { fontWeight: "bold" },
    "& h2": { margin: `${theme.spacing(1)}px 0px` },
    "& p": { fontSize: "1.2rem" },
    "& button": {
      marginTop: theme.spacing(2),
      fontWeight: 700,
      borderRadius: 9,
      padding: "10px 24px",
      backgroundColor: "#FFC001",
      "&:hover": {
        backgroundColor: "#ffcc33",
      },
    },
  },
  gridItem: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    margin: 0,
    padding: 0,
    fontWeight: "normal",
    display: "inline-block",
    [theme.breakpoints.only("sm")]: { width: "80%" },
    [theme.breakpoints.only("xs")]: {
      width: 210,
      fontSize: "2.6rem",
      marginLeft: theme.spacing(2),
    },
  },
  lets: {
    padding: 0,
    fontWeight: "bold",
    display: "inline-block",
    color: "#F4444F",
  },
  rootListIcon: {
    minWidth: 46,
    "& svg": { fontSize: "1.8rem" },
  },
  banner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: `${theme.spacing(5)}px 0px`,
    [theme.breakpoints.only("xs")]: { margin: 0 },
  },
  bannerWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    maxHeight: 360,
    "& img": {
      width: "100%",
      height: "auto",
    },
  },
  list: {
    "& svg": { [theme.breakpoints.only("xs")]: { fontSize: 24 } },
    "& p": { [theme.breakpoints.only("xs")]: { fontSize: "1rem" } },
  },
}));
const SuccessSignup = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.girdContainer} spacing={5}>
      <Grid item sm={6} className={classes.gridItem}>
        <div className={classes.bannerText}>
          <Typography variant="h1" color="primary" style={{ marginTop: 40 }}>
            Registered
          </Typography>
          <Typography variant="h2">Sucessfully</Typography>
          <div className={classes.bannerText}>
            <List className={classes.list}>
              <ListItem>
                <ListItemIcon classes={{ root: classes.rootListIcon }}>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="textSecondary">
                      Fast & Convenient
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon classes={{ root: classes.rootListIcon }}>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="textSecondary">
                      No Hassle, Easy Inventory Tracking
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon classes={{ root: classes.rootListIcon }}>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="textSecondary">
                      More Customers to Reach
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon classes={{ root: classes.rootListIcon }}>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="textSecondary">
                      Highlight your Store on the Map
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon classes={{ root: classes.rootListIcon }}>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="textSecondary">
                      Manage your funds wisely
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon classes={{ root: classes.rootListIcon }}>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="textSecondary">
                      Update your Product List that is visible to the customer
                      right away
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </div>
          <Button variant="contained" size="large" color="secondary">
            <Link style={{ textDecoration: "none", color: "#000" }} to="/login">
              Get Started
            </Link>
          </Button>
        </div>
      </Grid>
      <Grid item sm={6}>
        <div>
          <img src={successLogo} alt="" style={{ width: "100%" }} />
        </div>
      </Grid>
    </Grid>
  );
};

export default SuccessSignup;
