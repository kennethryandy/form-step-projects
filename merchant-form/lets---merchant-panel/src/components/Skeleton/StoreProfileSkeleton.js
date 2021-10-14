import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  card: {
    maxWidth: 345,
    margin: theme.spacing(2),
  },
  media: {
    height: 320,
    width: "100%",
    borderRadius: 10,
  },
  inputs: {
    margin: `0px ${theme.spacing(2)}px 0px 65px`,
  },
  input: {
    marginBottom: theme.spacing(5),
    height: 36,
    width: "100%",
    borderRadius: 10,
  },
  title: {
    borderRadius: 10,
    marginBottom: theme.spacing(1),
    height: 20,
    width: "60%",
  },
  text: {
    marginBottom: theme.spacing(5),
    height: 36,
    width: "180%",
    borderRadius: 10,
  },
}));

const StoreProfileSkeleton = () => {
  const classes = useStyles();
  return (
    <Grid container spacing={4}>
      <Grid item md={4}>
        <Skeleton animation="wave" variant="rect" className={classes.media} />
      </Grid>
      <Grid item md={4}>
        <Skeleton animation="wave" variant="rect" className={classes.title} />
        <Skeleton animation="wave" variant="rect" className={classes.input} />
        <Skeleton animation="wave" variant="rect" className={classes.title} />
        <Skeleton animation="wave" variant="rect" className={classes.input} />
        <Skeleton animation="wave" variant="rect" className={classes.title} />
        <Skeleton animation="wave" variant="rect" className={classes.input} />
        <Skeleton animation="wave" variant="rect" className={classes.title} />
        <Skeleton animation="wave" variant="rect" className={classes.input} />
        <Skeleton animation="wave" variant="rect" className={classes.title} />
        <Skeleton animation="wave" variant="rect" className={classes.text} />
      </Grid>
      <Grid item md={4}>
        <Skeleton animation="wave" variant="rect" className={classes.title} />
        <Skeleton animation="wave" variant="rect" className={classes.input} />
        <Skeleton animation="wave" variant="rect" className={classes.title} />
        <Skeleton animation="wave" variant="rect" className={classes.input} />
      </Grid>
    </Grid>
    // <div className={classes.root}>
    //   <div className={classes.root}>
    //     <Skeleton animation="wave" variant="rect" className={classes.media} />
    //     <div className={classes.inputs}>
    //       <Skeleton animation="wave" variant="rect" className={classes.title} />
    //       <Skeleton animation="wave" variant="rect" className={classes.input} />
    //       <Skeleton animation="wave" variant="rect" className={classes.title} />
    //       <Skeleton animation="wave" variant="rect" className={classes.input} />
    //       <Skeleton animation="wave" variant="rect" className={classes.title} />
    //       <Skeleton animation="wave" variant="rect" className={classes.input} />
    //       <Skeleton animation="wave" variant="rect" className={classes.title} />
    //       <Skeleton animation="wave" variant="rect" className={classes.input} />
    //       <Skeleton animation="wave" variant="rect" className={classes.title} />
    //       <Skeleton animation="wave" variant="rect" className={classes.text} />
    //     </div>
    //     <div className={classes.inputs}>
    //       <Skeleton animation="wave" variant="rect" className={classes.title} />
    //       <Skeleton animation="wave" variant="rect" className={classes.input} />
    //       <Skeleton animation="wave" variant="rect" className={classes.title} />
    //       <Skeleton animation="wave" variant="rect" className={classes.input} />
    //     </div>
    //   </div>
    // </div>
  );
};

export default StoreProfileSkeleton;
