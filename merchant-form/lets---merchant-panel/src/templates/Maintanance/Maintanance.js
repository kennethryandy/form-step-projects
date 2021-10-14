import React from "react";
import Title from "../../components/Dashboard/Title/Title";
import maintainanceImage from "../../assets/images/under-maintanance.png";
const Maintanance = ({ type, page }) => {
  return (
    <>
      <div className="dash-box">
        <Title type={type} page={page} />
      </div>
      <div className="dash-box d-flex align-items-center justify-content-center">
        <img src={maintainanceImage} alt="Under maintanance" />
      </div>
    </>
  );
};

export default Maintanance;
