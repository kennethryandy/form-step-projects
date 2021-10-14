import React, { useState, useEffect } from "react";
import FlipMove from "react-flip-move";
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
  addCategory,
  deleteCategory,
} from "../../../redux/actions/categoryActions";
//Mui
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  label: {},
  selectBtn: {
    flex: ".6",
    padding: "12px 22px",
    marginLeft: theme.spacing(3),
    borderRadius: "10px !important",
    color: "#FFF",
    [theme.breakpoints.only("xs")]: {
      marginLeft: theme.spacing(1),
      padding: "8px 22px",
    },
  },
  selectBtnYellow: {
    flex: ".6",
    padding: "12px 22px",
    marginLeft: theme.spacing(3),
    borderRadius: "10px !important",
    color: "#FFF",
    backgroundColor: "#ffc001",
    [theme.breakpoints.only("xs")]: {
      marginLeft: theme.spacing(1),
      padding: "8px 22px",
    },
    "&:hover": {
      backgroundColor: "#ffcc33",
    },
  },
  chipRoot: {
    margin: theme.spacing(1),
    fontSize: "1rem !important",
    height: "46px !important",
    borderRadius: "12px !important",
    // width: 108,
    "& svg": {
      marginLeft: "auto",
    },
    [theme.breakpoints.only("xs")]: {
      width: "40%",
      height: 38,
      fontSize: ".8rem",
    },
  },
  chipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: theme.spacing(4),
    width: "100%",
    "&>div": {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
  },
}));

const StoreCategory = ({ infos, setInfos, setErrors, isRequired, yellow }) => {
  const classes = useStyles();
  const categories = useSelector((state) => state.category.storeCategories);
  const dispatch = useDispatch();
  const [options, setOptions] = useState();
  const [categoryInput, setCategoryInput] = useState("");

  const handleSelectItem = (item) => {
    setErrors((prevState) => ({ ...prevState, category: "", isErrors: false }));
    setInfos((prevState) => ({
      ...prevState,
      category: item,
    }));
  };
  useEffect(() => {
    setOptions(categories);
  }, [categories]);

  const handleDeselectItem = (item) => {
    setInfos((prevState) => ({
      ...prevState,
      category: "",
    }));
  };

  const handleChange = (e) => {
    setCategoryInput(e.target.value);
  };

  const handleSubmitItem = () => {
    if (categoryInput) {
      const tempCategory = options.filter(
        (cat) => cat.item.toLowerCase() !== categoryInput.toLowerCase().trim()
      );
      const newCategory = {
        item: categoryInput,
        created_at: new Date().toISOString(),
        default: false,
      };
      dispatch(addCategory({ type: "storeCategories", category: newCategory }));
      setInfos((prevState) => ({
        ...prevState,
        category: categoryInput,
      }));
      setCategoryInput("");
    }
  };

  const handleRemoveItem = (option) => {
    if (option.item === infos.category) {
      setInfos((prevState) => ({
        ...prevState,
        category: "",
      }));
    }
    dispatch(deleteCategory({ type: "storeCategories", item: option.item }));
  };

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
      handleSubmitItem();
      evt.preventDefault();
    }
  };
  return (
    <>
      <label className={classes?.label}>
        Store Category {isRequired ? <span>*</span> : ""}
      </label>
      <div className="d-flex align-items-center mb-4">
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
          className={yellow ? classes.selectBtnYellow : classes.selectBtn}
        >
          Add
        </Button>
      </div>
      <div className={classes.chipsContainer}>
        <FlipMove>
          {categories.map((option) => (
            <Tooltip
              title={option.item}
              placement="top"
              key={option.created_at}
            >
              {infos?.category === option.item ? (
                <Chip
                  label={option.item}
                  clickable
                  onClick={() => handleDeselectItem(option.item)}
                  color="primary"
                  onDelete={
                    option.default ? null : () => handleRemoveItem(option)
                  }
                  classes={{ root: classes.chipRoot }}
                  style={{ backgroundColor: "#FFC001" }}
                />
              ) : (
                <Chip
                  label={option.item}
                  clickable
                  onDelete={
                    option.default ? null : () => handleRemoveItem(option)
                  }
                  onClick={() => handleSelectItem(option.item)}
                  classes={{ root: classes.chipRoot }}
                />
              )}
            </Tooltip>
          ))}
        </FlipMove>
      </div>
    </>
  );
};

export default StoreCategory;
