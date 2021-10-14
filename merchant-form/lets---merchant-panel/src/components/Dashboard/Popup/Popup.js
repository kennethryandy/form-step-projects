import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  activateStore,
  deactivateStore,
  permaDeleteStore,
} from "../../../redux/actions/userAction";
const Popup = ({ is_deactivated, modal, handleClose }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("deactivate");
  const confirmModal = () => {
    if (value === "deactivate") {
      if (is_deactivated) {
        dispatch(activateStore());
        handleClose();
      } else {
        dispatch(deactivateStore());
        handleClose();
      }
    } else if (value === "delete") {
      dispatch(permaDeleteStore());
      handleClose();
    } else {
      handleClose();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="pop-up" style={{ display: modal ? "block" : "none" }}>
      <div className="dash-box">
        <div className="row margin-bottom dash-box-rowhead dash-box-rowborder">
          <div className="col-12">
            <h4>
              {value === "deactivate"
                ? is_deactivated
                  ? "Activating"
                  : "Deactivating"
                : "Deleting"}{" "}
              Store Profile
            </h4>
            <p className="color-faded-black no-margin">
              Are you sure you want to{" "}
              {value === "deactivate"
                ? is_deactivated
                  ? "activate"
                  : "deactivate"
                : "delete"}{" "}
              store profile?
            </p>
          </div>
        </div>

        <div className="row margin-bottom">
          <form>
            <div className="col-12">
              <div className="btn-radio-wrap">
                <label
                  className="btn-radio-info"
                  style={{
                    borderColor:
                      value === "deactivate" || value === "activate"
                        ? "#ed3c60"
                        : "#dfe8f1",
                  }}
                >
                  <input
                    type="radio"
                    name="deactivate"
                    className="pop-input-radio"
                    value="deactivate"
                    checked={value === "deactivate"}
                    onChange={handleChange}
                  />

                  <div className="pop-radio">
                    <span className="radio"></span>
                  </div>

                  <div className="pop-info">
                    <h5>
                      {is_deactivated ? "Activate" : "Deactivate"} Account
                    </h5>
                    <p className="small color-faded-">
                      {is_deactivated
                        ? "Activating profile will Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel mi sollicitudin, suscipit felis ac, pellentesque massa. Duis aliquet eros est, sed finibus diam bibendum et. Praesent consequat,"
                        : "Deactivating your account can be temporary. Your store will be unmarked on the map. You'll be able to continue using this panel. If you wish to reactivate your account and become visible again on the map, just click activate."}
                    </p>
                  </div>
                </label>
                <label
                  className="btn-radio-info"
                  style={{
                    borderColor: value === "delete" ? "#ed3c60" : "#dfe8f1",
                  }}
                >
                  <input
                    type="radio"
                    name="deactivate"
                    className="pop-input-radio"
                    value="delete"
                    checked={value === "delete"}
                    onChange={handleChange}
                  />

                  <div className="pop-radio">
                    <span className="radio"></span>
                  </div>

                  <div className="pop-info">
                    <h5>Permanently Delete Account</h5>
                    <p className="small color-faded-">
                      Deleting your account is permanent. You won't be able to
                      retrieve any records of the products or information of
                      your customers.
                    </p>
                  </div>
                </label>
              </div>

              <div className="text-center">
                <button
                  className="btn btn-primary full-width margin-bottom"
                  onClick={confirmModal}
                  type="button"
                >
                  Confirm{" "}
                  {value === "deactivate"
                    ? is_deactivated
                      ? "Activation"
                      : "Deactivation"
                    : "Deletion"}
                </button>
                <button
                  className="btn color-faded-black full-width"
                  onClick={() => handleClose()}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;
