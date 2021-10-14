import React from "react";
import forgotpwBanner from "../../assets/images/forgot-pw-banner.svg";

const SuccessNewAccount = () => {
  return (
    <div style={{ height: "100vh" }}>
      <div className="row justify-content-center align-items-center h-100">
        <div
          className="col-sm-12 col-md-6 align-self-start"
          style={{ paddingLeft: "5rem" }}
        >
          <img src={letsLogo} alt="" className="lets-logo" />
          <form className="forgot-pw-form">
            <h1 className="color-black">
              <strong>Fogot password</strong>
            </h1>
            <label htmlFor="email" className="mb-4 color-black">
              Enter email address associated with your account.
            </label>
            <input
              //   value={email}
              //   onChange={handleChange}
              name="email"
              className="form-control forgotpw-input"
              type="email"
              placeholder="Email Address"
            />
            <button
              type="submit"
              className="btn btn-login btn-primary forgotpw-btn mt-5"
            >
              Send Reset Verification
            </button>
          </form>
        </div>
        <div className="col-sm-12 col-md-6">
          <img src={forgotpwBanner} alt="" />
        </div>
      </div>
    </div>
  );
};

export default SuccessNewAccount;
