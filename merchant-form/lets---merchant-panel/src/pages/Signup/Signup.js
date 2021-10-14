import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import lets from "../../assets/images/icon/lets-sign-in.svg";
//Mui
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Stepper from "../../components/Stepper/Stepper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Hidden from "@material-ui/core/Hidden";
//Redux
import { useDispatch } from "react-redux";
import { stepOne, validateCred } from "../../redux/actions/registerAction";

const Signup = ({
  data,
  handleBack,
  handleNext,
  isCredValid,
  setIsCredValid,
  classes,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    password_type: {
      password: false,
      confirmPw: false,
    },
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    termsAgreed: false,
    errors: {},
    loading: false,
  });

  useEffect(() => {
    if (data.stepOne) {
      setState((prevState) => ({
        ...prevState,
        ...data.stepOne,
        confirm_password: data.stepOne.password,
        termsAgreed: true,
      }));
    }
  }, [data.stepOne]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isCredValid[name]) {
      setIsCredValid((prevState) => ({
        ...prevState,
        [name]: false,
      }));
    }
    setState((prevState) => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        [name]: [name] ? "" : [name],
      },
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!state.email || !state.username || !state.password) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          password: prevState.password ? "" : "Password must not be empty.",
          email: prevState.email ? "" : "Email must not be empty.",
          username: prevState.username ? "" : "Username must not be empty.",
        },
      }));
    } else {
      if (state.confirm_password !== state.password) {
        setState((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            confirm_password: "Password and confirm password does not match.",
          },
        }));
      } else if (!state.termsAgreed) {
        setState((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            termsAgreed: "Please accept Terms and Conditions to continue.",
          },
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          errors: {},
        }));
        const stepOneData = {
          email: state.email,
          username: state.username,
          password: state.password,
        };
        dispatch(stepOne(stepOneData));
        handleNext();
      }
    }
  };

  const handleViewClick = (type) => {
    setState((prevState) => ({
      ...prevState,
      password_type: {
        ...prevState.password_type,
        [type]: !prevState.password_type[type],
      },
    }));
  };
  const onEmailBlur = () => {
    if (state.email && !state.errors.email && !isCredValid.email) {
      const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!regex.test(state.email)) {
        setState((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            email: "Invalid email address.",
          },
        }));
      } else {
        setLoading(true);
        validateCred({ username: "", email: state.email }).then((res) => {
          if (res.data?.success) {
            setLoading(false);
            setIsCredValid((prevState) => ({
              ...prevState,
              email: true,
            }));
          } else {
            setIsCredValid((prevState) => ({
              ...prevState,
              email: false,
            }));
            setState((prevState) => ({
              ...prevState,
              errors: {
                ...prevState.errors,
                email: "Email already taken.",
              },
            }));
            setLoading(false);
          }
        });
      }
    } else {
      return;
    }
  };

  const onUsernameBlur = () => {
    if (state.username && !state.errors.username && !isCredValid.username) {
      setLoading(true);
      validateCred({ username: state.username, email: "" }).then((res) => {
        if (res.data?.success) {
          setLoading(false);
          setIsCredValid((prevState) => ({
            ...prevState,
            username: true,
          }));
        } else {
          setLoading(false);
          setState((prevState) => ({
            ...prevState,
            errors: {
              ...prevState.errors,
              username: "Username already taken.",
            },
          }));
          setIsCredValid((prevState) => ({
            ...prevState,
            username: false,
          }));
        }
      });
    } else {
      return;
    }
  };

  return (
    <div className={classes.stepContainer}>
      <Hidden smUp>
        <img src={lets} alt="Lets" />
      </Hidden>
      <div className={classes.signUpHeader}>
        <div>
          <h1>
            <strong>Sign up</strong>
          </h1>
          <p className="small">
            Already have an account?{" "}
            <Link to="/login" className="color-red text-underline" tabIndex="7">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="username" className="color-black">
              Username
            </label>
            <span className="input-wrap-icon">
              <input
                id="username"
                name="username"
                type="text"
                className="form-control"
                aria-describedby="username"
                placeholder="Username"
                value={state.username}
                onChange={handleChange}
                onBlur={onUsernameBlur}
                disabled={loading}
                tabIndex="1"
                style={{
                  borderColor:
                    (data.error && data.error?.includes("Username")) ||
                    state.errors.username
                      ? "red"
                      : "#dfe8f1",
                }}
              />
              {state.errors.username && (
                <span className="icon">
                  <ClearIcon className="error" />
                </span>
              )}
              {isCredValid.username && !state.errors.username && (
                <span className="icon">
                  <CheckIcon className="success" />
                </span>
              )}
            </span>
          </div>
          {state.errors.username && (
            <small className="form-text text-danger">
              {state.errors.username}
            </small>
          )}
        </div>

        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="email" className="color-black">
              Email
            </label>
            <span className="input-wrap-icon">
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                aria-describedby="email"
                placeholder="email@letsmerchant.com"
                value={state.email}
                onChange={handleChange}
                onBlur={onEmailBlur}
                tabIndex="2"
                disabled={loading}
                style={{
                  borderColor:
                    (data.error && data.error?.includes("Email")) ||
                    state.errors.email
                      ? "red"
                      : "#dfe8f1",
                }}
              />
              {state.errors.email && (
                <span className="icon">
                  <ClearIcon className="error" />
                </span>
              )}
              {isCredValid.email && !state.errors.email && (
                <span className="icon">
                  <CheckIcon className="success" />
                </span>
              )}
            </span>
          </div>
          {state.errors.email && (
            <small className="form-text text-danger">
              {state.errors.email}
            </small>
          )}
        </div>

        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="password" className="color-black">
              Password
            </label>
            <span className="input-wrap-icon">
              <input
                id="password"
                name="password"
                type={state.password_type.password ? "text" : "password"}
                className="form-control"
                aria-describedby="password"
                placeholder="Password"
                value={state.password}
                onChange={handleChange}
                tabIndex="3"
              />
              <button
                className="btn-eye"
                onClick={() => handleViewClick("password")}
                type="button"
              >
                {state.password_type.password ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </button>
            </span>
            {state.errors.password && (
              <small className="form-text text-danger">
                {state.errors.password}
              </small>
            )}
          </div>
        </div>

        <div className="col-sm-12 signup-bottom-space">
          <div className="form-group">
            <label htmlFor="confirm_password" className="color-black">
              Confirm Password
            </label>
            <span className="input-wrap-icon">
              <input
                id="confirm_password"
                name="confirm_password"
                type={state.password_type.confirmPw ? "text" : "password"}
                className="form-control"
                aria-describedby="confirm_password"
                placeholder="Confirm Password"
                value={state.confirm_password}
                onChange={handleChange}
                tabIndex="4"
              />
              <button
                className="btn-eye"
                onClick={() => handleViewClick("confirmPw")}
                type="button"
              >
                {state.password_type.confirmPw ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </button>
            </span>
          </div>
          {state.errors.confirm_password && (
            <small className="form-text text-danger mt-2">
              {state.errors.confirm_password}
            </small>
          )}
          {state.errors.termsAgreed && (
            <small className="form-text text-danger mt-2">
              {state.errors.termsAgreed}
            </small>
          )}
          {data.error && (
            <small className="form-text text-danger mt-2">{data.error}</small>
          )}
        </div>

        <div className="col-sm-12">
          <div className="form-group form-space-top">
            <span className="checkbox">
              <input
                id="store-agreement"
                type="checkbox"
                className="form-check-input"
                checked={state.termsAgreed}
                onChange={() =>
                  setState((prevState) => ({
                    ...prevState,
                    termsAgreed: !state.termsAgreed,
                  }))
                }
                tabIndex="5"
              />
              <span className="checkmark"></span>
            </span>
            <label className="form-check-label" htmlFor="store-agreement">
              I agree to the{" "}
              <a href="/terms" target="_blank" className="color-red">
                Terms and Conditions
              </a>
            </label>
          </div>
          {state.errors.general && (
            <small className="form-text text-danger mt-2">
              {state.errors.general}
            </small>
          )}
        </div>
        <Stepper
          steps={8}
          activeStep={data.steps}
          handleNext={handleSubmit}
          handleBack={handleBack}
          disabled={
            !state.email ||
            !state.username ||
            !state.password ||
            !state.confirm_password ||
            !state.termsAgreed ||
            !isCredValid.username ||
            !isCredValid.email
          }
        />
      </div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Signup;
