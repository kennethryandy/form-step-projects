import React from "react";
import priceTagIcon from "../../../assets/images/icon/price-tag-icon.svg";
import linChartIcon from "../../../assets/images/icon/line-chart-icon.svg";

function WalletHead() {
  return (
    <>
      <div className="row">
        <div className="dash-box">
          <div className="row v-align py-2">
            <h4 className="margin-right ml-2">Wallet</h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12 col-md-6 pl-0">
          <div className="dash-box">
            <div className="d-flex align-items-center mb-3">
              <div className="icon-box red mr-3">
                <img src={priceTagIcon} alt="" className="wallet-icon" />
              </div>
              <div>
                <h5 className="no-margin">2000$</h5>
                <p className="no-margin">
                  <span className="color-faded-black">Sales</span>
                </p>
              </div>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: "48%", backgroundColor: "#ED3C60" }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p className="color-faded-black">Better than last week (25%)</p>
          </div>
        </div>
        <div className="col-xs-12 col-md-6 pr-0">
          <div className="dash-box">
            <div className="d-flex align-items-center mb-3">
              <div className="icon-box blue mr-3">
                <img src={linChartIcon} alt="" className="wallet-icon" />
              </div>
              <div>
                <h5 className="no-margin">2000$</h5>
                <p className="no-margin">
                  <span className="color-faded-black">Sales</span>
                </p>
              </div>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: "25%", backgroundColor: "#4BA4FF" }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p className="color-faded-black">Worse than last week (25%)</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default WalletHead;
