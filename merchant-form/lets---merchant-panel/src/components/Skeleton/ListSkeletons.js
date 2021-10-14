import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  list: {
    borderRadius: 10,
    margin: theme.spacing(1),
    height: 20,
    maxWidth: 200,
  },
}));

const ListSkeletons = ({ length }) => {
  const classes = useStyles();
  return [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
    <tr key={i}>
      <td>
        <Skeleton animation="wave" variant="rect" className={classes.list} />
      </td>
      <td>
        <Skeleton animation="wave" variant="rect" className={classes.list} />
      </td>
      <td>
        <Skeleton animation="wave" variant="rect" className={classes.list} />
      </td>
      <td>
        <Skeleton animation="wave" variant="rect" className={classes.list} />
      </td>
      <td>
        <Skeleton animation="wave" variant="rect" className={classes.list} />
      </td>
      <td>
        <Skeleton animation="wave" variant="rect" className={classes.list} />
      </td>
      {length > 6 && (
        <>
          <td>
            <Skeleton
              animation="wave"
              variant="rect"
              className={classes.list}
            />
          </td>
          <td>
            <Skeleton
              animation="wave"
              variant="rect"
              className={classes.list}
            />
          </td>
        </>
      )}
    </tr>
  ));
};

export default ListSkeletons;
