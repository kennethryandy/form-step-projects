import React, { useState, useEffect } from "react";
import letsSignIn from "../../assets/images/icon/lets-sign-in.svg";
import jwtDecode from "jwt-decode";
import { Link, useParams, useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, resetPassword } from "../../redux/actions/userAction";
// import {stepOne} from '../../redux/actions/registerAction'
//mui
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
const NewAccount = () => {
  const isAuth = useSelector((state) => state.user.authenticated);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
    errors: {},
  });
  const [showPw, setShowPw] = useState({
    password: false,
    confirmPw: false,
  });

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(params.token);
      if (decodedToken) {
        if (isAuth) {
          dispatch(logoutUser());
        }
      }
      return;
    } catch (error) {
      history.push("/");
    }
  }, [params.token, history]);

  const showPass = (type) => {
    setShowPw((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      errors: {},
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.password < 4) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...state.errors,
          password: "Password must have at least 6 characters.",
        },
      }));
    } else if (state.password !== state.confirmPassword) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...state.errors,
          error: "Password and confirm password must match.",
        },
      }));
    } else {
      setLoading(true);
      const data = {
        password: state.password,
        confirm_password: state.confirmPassword,
        token: params.token,
      };
      resetPassword(data).then((res) => {
        if (res?.data.success) {
          setLoading(false);
          history.push("/login");
        } else {
          setState((prevState) => ({
            ...prevState,
            errors: {
              general:
                "Token is invalid or expired please try sending email again.",
            },
          }));
        }
        setLoading(false);
      });
    }
  };
  return (
    <div style={{ marginBottom: 160 }}>
      <img src={letsSignIn} alt="" className="lets-sign-in-logo" />
      <form onSubmit={handleSubmit}>
        <h1 className="signin-bottom-space">
          <strong>ENTER NEW PASSWORD</strong>
        </h1>

        <div className="row">
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <span className="input-wrap-icon">
                <input
                  //   disabled={UI.loading}
                  id="password"
                  type={showPw.password ? "text" : "password"}
                  name="password"
                  className="form-control"
                  aria-describedby="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={state.password}
                  tabIndex="1"
                />
                <button
                  type="button"
                  className="btn-eye"
                  onClick={() => showPass("password")}
                >
                  {showPw.password ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
              <label htmlFor="confirmPassword">Confirm Password</label>
              <span className="input-wrap-icon">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPw.confirmPw ? "text" : "password"}
                  className="form-control"
                  aria-describedby="confirm_password"
                  placeholder="Confirm Password"
                  value={state.confirmPassword}
                  onChange={handleChange}
                  tabIndex="2"
                />
                {/* <IconButton>
                  <VisibilityIcon />
                </IconButton> */}
                <button
                  className="btn-eye"
                  onClick={() => showPass("confirmPw")}
                  type="button"
                >
                  {showPw.confirmPw ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </button>
              </span>
              {state.errors.error && (
                <small className="form-text text-danger">
                  {state.errors.error}
                </small>
              )}
            </div>
          </div>

          <div className="col-sm-12">
            <div className="form-group">
              <small className="form-text text-danger mb-2">
                {state.errors?.general}
              </small>
              <button
                className={`${
                  loading ? "btn-secondary" : "btn-primary"
                } btn btn-login full-width`}
                onClick={handleSubmit}
                style={{
                  border: loading ? "none" : "1px solid #ed3c60 !important",
                }}
                disabled={loading}
                type="submit"
                tabIndex="3"
              >
                Update My Password
              </button>
            </div>
          </div>

          <div className="col-sm-12">
            <div className="form-group text-center">
              <p className="small">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="color-red text-underline"
                  tabIndex="4"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewAccount;
