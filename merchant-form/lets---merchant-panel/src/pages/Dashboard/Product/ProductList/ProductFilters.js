import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
//Redux
import {useSelector} from 'react-redux'
//Mui
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import RedoIcon from "@material-ui/icons/Redo";
import AddIcon from '@material-ui/icons/Add';

function ProductFilters({
  classes,
  products,
  filterCategory,
  selectedCategory,
  selectedStatus,
  filterStatus,
  loading,
  resetFilters,
}) {
  const categories = useSelector(state => state.category.productCategories)
  const selected = categories.filter(item => item.selected)
  // const [categories, setCategories] = useState([]);
  // useEffect(() => {
  //   const set = new Set(products?.map((product) => product.category));
  //   setCategories([...set]);
  // }, [products]);
  return (
    <div>
      <div className="dash-box-rowborder py-4">
        <Typography variant="body1" align="center" color="textSecondary">
          Filter Search
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3">
        <Typography variant="body1" align="center" color="textSecondary">
          Status
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3 d-flex flex-column">
        <Button
          className={classes.filterBtn}
          variant={selectedStatus === "In-Stock" ? "contained" : "outlined"}
          color={selectedStatus === "In-Stock" ? "secondary" : "default"}
          onClick={() => filterStatus("In-Stock")}
          disabled={loading}
          style={{
            border:
              selectedStatus === "In-Stock"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
        >
          In-Stock
        </Button>
        <Button
          variant={selectedStatus === "Out of Stock" ? "contained" : "outlined"}
          color={selectedStatus === "Out of Stock" ? "secondary" : "default"}
          style={{
            border:
              selectedStatus === "Out of Stock"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
          className={classes.filterBtn}
          onClick={() => filterStatus("Out of Stock")}
          disabled={loading}
        >
          Out of Stock
        </Button>
      </div>
      <div className="dash-box-rowborder py-3">
        <Typography variant="body1" align="center" color="textSecondary">
          Category
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3 d-flex flex-column">
        {(categories && selected.length > 0 && categories.length > 0) ? categories.map((category, i) => (
            category.selected && (
              <Button
                key={i}
                variant="text"
                className={`${
                  selectedCategory === category.item ? "filter-active" : ""
                } ${classes.filterBtn}`}
                onClick={() => filterCategory(category.item)}
              >
                <Typography
                  variant="subtitle2"
                  color={
                    selectedCategory === category.item ? "inherit" : "textSecondary"
                  }
                >
                  {category.item}
                </Typography>
              </Button>
            )
        )) : (
          <div className={classes.noFilter}>
            <Typography variant="body1">
              No Categories
            </Typography>
            <IconButton size="small" component={Link} to="/product/categories">
              <AddIcon />
            </IconButton>
          </div>
        )}
      </div>
      <div className="dash-box-rowborder py-3 d-flex align-items-center justify-content-center">
        <Button
          color="primary"
          className={classes.filterBtn}
          endIcon={<RedoIcon />}
          onClick={resetFilters}
          style={{ paddingLeft: 20 }}
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
}

export default ProductFilters;
