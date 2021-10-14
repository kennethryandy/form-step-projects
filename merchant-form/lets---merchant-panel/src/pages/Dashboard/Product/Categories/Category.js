import React, { useState } from "react";
import FlipMove from "react-flip-move";
//redux
import { useSelector, useDispatch } from "react-redux";
import {
  addCategory,
  deleteCategory,
  selectCategory,
} from "../../../../redux/actions/categoryActions";
//Mui
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import useStyles from "./categoryStyle";

import Title from "./Title";
const Category = () => {
  const classes = useStyles();
  const categories = useSelector((state) => state.category.productCategories);
  const dispatch = useDispatch();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState({});
  const [categoryInput, setCategoryInput] = useState("");

  const handleClose = () => {
    setShowSnackBar(false);
  };

  const handleSelectItem = (item) => {
    dispatch(selectCategory({ type: "productCategories", item }));
  };

  const handleDeleteItem = (option) => {
    setSnackbarMsg({
      msg: "Category deleted!",
      color: "error",
      key: option.created_at,
    });
    setShowSnackBar(true);
    dispatch(deleteCategory({ type: "productCategories", item: option.item }));
  };

  const handleChange = (e) => {
    setCategoryInput(e.target.value);
  };

  const handleSubmitItem = () => {
    if (categoryInput) {
      setSnackbarMsg({
        msg: "Category added!",
        color: "success",
        key: new Date().toISOString() + Math.random() * 5,
      });
      const newCategory = {
        item: categoryInput,
        created_at: new Date().toISOString() + Math.random() * 5,
        selected: true,
      };
      dispatch(
        addCategory({ type: "productCategories", category: newCategory })
      );
      setCategoryInput("");
      setShowSnackBar(true);
    }
  };

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
      handleSubmitItem();
      evt.preventDefault();
    }
  };

  return (
    <div>
      <Title classes={classes} />
      <Paper elevation={0} className={classes.paperRoot}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "cneter",
            margin: 8,
          }}
        >
          <input
            onChange={handleChange}
            placeholder="Store Category"
            className="form-control"
            style={{ flex: "2.5" }}
            onKeyDown={handleKeyDown}
            value={categoryInput}
          />
          <Button
            color="secondary"
            size="large"
            variant="contained"
            onClick={handleSubmitItem}
            className={classes.selectBtn}
          >
            Add
          </Button>
        </div>
        <div className={classes.chipsContainer}>
          <FlipMove>
            {categories.map((option, i) => (
              <Tooltip
                title={option.item}
                placement="top"
                key={option.created_at}
              >
                <Chip
                  label={option.item}
                  clickable
                  onClick={() => handleSelectItem(option)}
                  onDelete={
                    option.default ? null : () => handleDeleteItem(option)
                  }
                  className={option.selected ? classes.selected : ""}
                  classes={{ root: classes.chipRoot }}
                />
              </Tooltip>
            ))}
          </FlipMove>
        </div>
      </Paper>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message={snackbarMsg?.msg}
        className={classes.snackbar}
        classes={{
          root:
            snackbarMsg.color === "success"
              ? classes.snackBarSuccess
              : classes.snackBarError,
        }}
        key={snackbarMsg.key}
      />
    </div>
  );
};

export default Category;
