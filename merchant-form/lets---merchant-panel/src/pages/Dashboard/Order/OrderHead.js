import React from "react";
import { Link } from "react-router-dom";
function OrderHead({ id, status }) {
  return (
    <div className="dash-box">
      <div className="row v-align justify-content-between">
        <div className="col d-flex">
          <h4 className="margin-right">
            <Link
              to="/orders"
              className="icon icon-return dash-box-return"
            ></Link>
            Transaction Number
          </h4>
          <h4 className="no-margin">
            <span className="color-faded-black"> / {id}</span>
          </h4>
        </div>
        <div className="col d-flex align-items-center justify-content-end">
          <div
            className={
              status === "processed"
                ? "circle ellipse-green"
                : status === "cancelled_by_merchant"
                ? "circle ellipse-red"
                : "circle ellipse-yellow"
            }
          />
          <p className="no-margin text-center text-capitalize">
            {status === "cancelled_by_merchant" ? "canceled" : status === "processed" ? "completed" : status}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderHead;
