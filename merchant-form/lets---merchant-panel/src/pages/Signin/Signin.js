import React, { Component } from "react";
import letsSignIn from "../../assets/images/icon/lets-sign-in.svg";
import { Link, withRouter } from "react-router-dom";
import "./Signin.css";
//Redux
import { loginUser } from "../../redux/actions/userAction";
import { connect } from "react-redux";
//mui
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

class Signin extends Component {
  state = {
    username: "",
    password: "",
    password_type: false,
    errors: {},
  };

  componentDidMount() {
    const user = this.props.user.stepOne;
    if (user) {
      this.setState((prevState) => ({
        ...prevState,
        username: user.username,
        password: user.password,
      }));
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        [name]: [name] ? "" : [name],
      },
      [name]: value,
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (!username || !password) {
      this.setState((prevState) => ({
        ...prevState,
        errors: {
          username: username ? "" : "Username/Email must not be empty.",
          password: password ? "" : "Password must not be empty.",
        },
      }));
    } else {
      const userData = {
        username,
        password,
      };
      this.props.loginUser(userData, this.props.history);
    }
  };

  handleViewClick = () => {
    this.setState((prevState) => ({
      ...prevState,
      password_type: !prevState.password_type,
    }));
  };

  render() {
    const { username, password, errors } = this.state;
    const { UI } = this.props;
    return (
      <div className="signin-container">
        <img src={letsSignIn} alt="" className="lets-sign-in-logo" />
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <h1 className="signin-bottom-space color-black text-uppercase">
            <strong>Sign in</strong>
          </h1>

          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="username" className="color-black">
                  Username
                </label>
                <input
                  disabled={UI.loading}
                  id="username"
                  type="text"
                  name="username"
                  className="form-control"
                  aria-describedby="username"
                  placeholder="Username/Email"
                  onChange={(e) => this.handleChange(e)}
                  value={username}
                />
                {errors.username && (
                  <small className="form-text text-danger">
                    {errors.username}
                  </small>
                )}
              </div>
            </div>

            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="password" className="color-black">
                  Password
                </label>
                <span className="input-wrap-icon">
                  <input
                    disabled={UI.loading}
                    id="password"
                    type={this.state.password_type ? "text" : "password"}
                    name="password"
                    className="form-control"
                    aria-describedby="password"
                    placeholder="Password"
                    onChange={(e) => this.handleChange(e)}
                    value={password}
                  />
                  <button
                    type="button"
                    className="btn-eye"
                    onClick={this.handleViewClick}
                  >
                    {this.state.password_type ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </button>
                </span>
                {errors.password && (
                  <small className="form-text text-danger">
                    {errors.password}
                  </small>
                )}
              </div>
            </div>
            <div className="col-sm-12 text-right">
              <div className="form-group form-space-top signin-bottom-space">
                <Link to="/forgot-password" className="color-faded-black">
                  Forgot Password
                </Link>
              </div>
            </div>

            <div className="col-sm-12">
              <div className="form-group">
                {UI.error && (
                  <small className="form-text text-danger mb-2">
                    {UI.error}
                  </small>
                )}
                <button
                  className={`${
                    UI.loading ? "btn-secondary" : "btn-primary"
                  } btn btn-login full-width`}
                  onClick={(e) => this.handleSubmit(e)}
                  disabled={UI.loading}
                  type="submit"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="col-sm-12">
              <div className="form-group text-center">
                <p className="small">
                  Don't have an account?{" "}
                  <a href="/register" className="color-red text-underline">
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  UI: state.UI,
  user: state.registerSteps,
});

export default connect(mapStateToProps, { loginUser })(withRouter(Signin));
