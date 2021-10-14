import React, { useEffect, useRef, useState } from "react";
import hintIcon from "../../../assets/images/icon/help-circle.svg";
import calendar from "../../../assets/images/icon/calendar.svg";
import dropdown from "../../../assets/images/icon/dropdown2.png";
function WalletBodyLeft() {
  const progRef = useRef();
  const rightRef = useRef();
  const leftRef = useRef();
  const [percent] = useState(76);
  useEffect(() => {
    calcBar();
  });

  const calcBar = () => {
    const value = progRef.current?.dataset.value;

    if (value > 0) {
      if (value <= 50) {
        rightRef.current.style.transform = `rotate(${percentageToDegrees(
          value
        )}deg)`;
      } else {
        rightRef.current.style.transform = "rotate(180deg)";
        leftRef.current.style.transform = `rotate(${percentageToDegrees(
          value - 50
        )}deg)`;
      }
    }
  };

  const percentageToDegrees = (percentage) => (percentage / 100) * 360;

  return (
    <>
      <div className="row">
        <div className="dash-box">
          <div className="d-flex align-items-center justify-content-between dash-box-rowborder py-3">
            <h4 className="margin-right">Sale</h4>
            <div className="d-flex">
              <div>
                <button className="btn btn-warning btn-sm mr-3">
                  Data Range
                </button>
              </div>
              <div>
                <button className="btn btn-outline-secondary btn-sm">
                  Choose Time Period
                  <img src={dropdown} className="ml-2" alt="" />
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="pt-4 mr-4">
              <div className="d-flex ">
                <img className="align-self-start mr-2" src={hintIcon} alt="" />
                <div>
                  <p className="color-faded-black no-margin small">
                    Average Sales
                  </p>
                  <p className="medium no-margin">2000$</p>
                </div>
              </div>
            </div>
            <div className="pt-4 ml-4">
              <div className="d-flex ">
                <img className="align-self-start mr-2" src={hintIcon} alt="" />
                <div>
                  <p className="color-faded-black no-margin small">
                    Total Sales
                  </p>
                  <p className="medium no-margin">2000$</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="dash-box d-flex align-items-center">
          <div className="col-xs-12 col-md-7 my-4">
            <div className="form-group">
              <label className="color-faded-black">Select Date From:</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <img src={calendar} alt="" />
                  </span>
                </div>
                <input
                  className="form-control"
                  type="date"
                  placeholder="Select Start Date"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="color-faded-black">Select Date To:</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <img src={calendar} alt="" />
                  </span>
                </div>
                <input
                  className="form-control"
                  type="date"
                  placeholder="Select Start Date"
                />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-5 my-4">
            <div
              className="circle-progress progress mx-auto"
              data-value={percent.toString()}
              ref={progRef}
            >
              <span className="progress-left">
                <span
                  className="left-circle progress-bar"
                  style={{ borderColor: "#ED3C60" }}
                  ref={leftRef}
                ></span>
              </span>
              <span className="progress-right">
                <span
                  className="right-circle progress-bar"
                  style={{ borderColor: "#ED3C60" }}
                  ref={rightRef}
                ></span>
              </span>
              <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                <div className="h2 font-weight-bold text-red">
                  {percent}
                  <sup className="small">%</sup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WalletBodyLeft;
