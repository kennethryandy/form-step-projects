import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
//Mui
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";
import useStyles from "../customerStyle";
import DeletePopup from "../../../../components/Dashboard/Popup/DeletePopup";

const CustomerTop = ({ search, selected, handleDeleteItems }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    if (selected.length > 0) {
      setOpen(true);
    } else {
      return;
    }
  };

  const confirmDelete = () => {
    setOpen(false);
    handleDeleteItems();
  };
  return (
    <div className="dash-box">
      <div className="row v-align">
        <div className="col-xs-12 col-md-2">
          <h4 className="no-margin">Customers</h4>
        </div>
        <div className="col-xs-12 col-md-7">
          <div className={classes.actions}>
            <div className="action-dropdown">
              <Dropdown>
                <Dropdown.Toggle
                  varian="default"
                  className="full-width btn btn-warning dropdown-toggle text-left"
                >
                  Select Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    className={classes.dropDownItem}
                    onClick={handleOpen}
                  >
                    <div className="dropdown-item">
                      <CloseIcon color="primary" />
                      <Typography variant="body2" color="primary">
                        Ban
                      </Typography>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-xs-12 col-md-8">
              <div className="search-box">
                <input
                  type="text"
                  className="form-control form-control-round form-control-noborder"
                  placeholder="Search something here..."
                  value={search.value}
                  onChange={search.onChange}
                />
                <Link to="#" className="search">
                  <i className="icon icon-search"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeletePopup
        open={open}
        item="customer"
        length={selected.length}
        handleClose={handleClose}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default CustomerTop;
