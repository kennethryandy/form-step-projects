import React, { useEffect, useRef } from "react";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  anchorOriginTopLeftRectangle: {
    top: 30,
  },
  badge: {
    height: 36,
    width: 36,
    borderRadius: 18,
    border: "3px solid #fff",
  },
  badgeRoot: {
    display: "block",
    margin: `20px 15px`,
  },
}));

const CustomBadge = ({
  children,
  badgeContent,
  badgeStyle,
  paperStyle,
  errors,
}) => {
  const classes = useStyles();
  const paperRef = useRef();
  useEffect(() => {
    if (errors) {
      paperRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [errors]);
  return (
    <Badge
      color="primary"
      badgeContent={badgeContent}
      overlap="rectangle"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      style={badgeStyle}
      classes={{
        anchorOriginTopLeftRectangle: classes.anchorOriginTopLeftRectangle,
        badge: classes.badge,
        root: classes.badgeRoot,
      }}
    >
      <Paper
        ref={paperRef}
        elevation={3}
        style={{
          padding: "32px 24px",
          border: errors ? "1px solid red" : "",
          ...paperStyle,
        }}
      >
        {children}
        <Typography
          variant="body2"
          color="error"
          style={{ marginTop: ".875rem" }}
        >
          {errors}
        </Typography>
      </Paper>
    </Badge>
  );
};

export default CustomBadge;
