import React, { useState } from "react";
import "./Forgotpw.css";
import forgotpwBanner from "../../assets/images/forgot-pw-banner.svg";
import letsLogo from "../../assets/images/icon/lets-sign-in.svg";
import { forgotPassword } from "../../redux/actions/userAction";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    if (emailError) {
      setEmailError("");
    }
    setEmail(e.target.value);
  };
  const handleBlur = (e) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regex.test(e.target.value) && email) {
      setEmailError("Invalid email address.");
    }
    return;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (email) {
      forgotPassword({ email }).then((res) => {
        if (res?.data.success) {
          setIsSending(false);
        } else {
          setEmailError("Account doesn't exist!");
        }
      });
      setLoading(false);
    } else {
      setLoading(false);
      return;
    }
  };
  return (
    <div style={{ height: "100vh" }}>
      <div className="row justify-content-center align-items-center h-100 w-100">
        <div
          className="col-sm-12 col-md-6 align-self-start"
          style={{ paddingLeft: "5rem" }}
        >
          <img src={letsLogo} alt="" className="lets-logo" />
          {isSending ? (
            <div className="forgot-pw-container">
              <form onSubmit={handleSubmit}>
                <h1 className="color-black">
                  <strong>Forgot password</strong>
                </h1>
                <label htmlFor="email" className="mb-4 color-black">
                  Enter email address associated with your account.
                </label>
                <input
                  value={email}
                  onChange={handleChange}
                  name="email"
                  className="form-control forgotpw-input"
                  type="text"
                  placeholder="Email Address"
                  onBlur={handleBlur}
                />
                <Typography variant="body2" color="error" className="mt-2">
                  {emailError}
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="mt-5 forgotpw-btn"
                  style={{
                    border: loading ? "" : "1px solid #ed3c60 !important",
                  }}
                  disabled={loading}
                >
                  Send Reset Verification
                </Button>
                <p className="small mt-3">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="color-red text-underline"
                    tabIndex="7"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          ) : (
            <div className="forgot-pw-container">
              <div>
                <h1 className="color-black">
                  <strong>Check your email</strong>
                </h1>
                <Typography variant="body1">
                  Click on the provided link to reset your password.
                </Typography>
              </div>
              <div className="w-75 mt-4">
                <Typography variant="body1">
                  If you don't see the email, check other places it might be,
                  like your junk, spam, social or other folders.
                </Typography>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="mt-4 forgotpw-btn"
                onClick={() => setIsSending(true)}
              >
                I didn't receive an email
              </Button>
            </div>
          )}
        </div>
        <div className="col-sm-12 col-md-6">
          <img src={forgotpwBanner} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
