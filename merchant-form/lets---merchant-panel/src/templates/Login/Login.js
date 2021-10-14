import React, { Component } from "react";
import captionImage from "./../../assets/images/login-profile.png";
import signup1 from "../../assets/images/slides/signup1.png";
import signup2 from "../../assets/images/slides/signup2.png";
import signup3 from "../../assets/images/slides/signup3.png";
import signup4 from "../../assets/images/slides/signup4.png";
import signup5 from "../../assets/images/slides/signup5.png";
import login1 from "../../assets/images/slides/login1.png";
import login2 from "../../assets/images/slides/login2.png";
import login3 from "../../assets/images/slides/login3.png";
import login4 from "../../assets/images/slides/login4.png";
import "./Login.css";

import Carousel from "react-bootstrap/Carousel";

const signInSlides = [
  {
    img: login1,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
  {
    img: login2,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
  {
    img: login3,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
  {
    img: login4,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
];

const signupSlides = [
  {
    img: signup1,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
  {
    img: signup2,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
  {
    img: signup3,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
  {
    img: signup4,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
  {
    img: signup5,
    text:
      "Being able to surprise and delight our customers with a complimentary ride with LETS is a great way to build upon our broader national partnership with LETS and make it more convenient than ever to travel to and from our shopping centers.",
  },
];

class Login extends Component {
  render() {
    if (this.props.page === "sign-in") {
      return (
        <div className="container-fluid form-container">
          <div className="row">
            <div className="col-sm-12 col-lg-5 form-login-wrap m-auto">
              <div className="row">
                <div className="col-sm-12 col-md-10 offset-md-1 col-xl-8 offset-xl-2">
                  {this.props.childComp}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-lg-7 no-padding">
              <Carousel interval={3000} controls={false} indicators>
                {signInSlides.map((item, i) => (
                  <Carousel.Item key={i}>
                    <img
                      className="d-block w-100"
                      src={item.img}
                      alt="First slide"
                    />
                    <Carousel.Caption>
                      <div className="row mb-5">
                        <div className="col-sm-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                          <p>{item.text}</p>
                          <br />
                          <p>
                            <img
                              className=""
                              src={captionImage}
                              alt="First slide"
                            />
                          </p>
                          <p className="no-margin">Kathy Miller</p>
                          <p className="no-margin small small-xs color-faded-white">
                            LETS Merchant
                          </p>
                        </div>
                      </div>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container-fluid form-container ">
          <div className="row">
            <div className="col-sm-12 order-md-12 col-lg-5 form-login-wrap m-auto">
              <div className="row">
                <div className="col-sm-12 col-md-10 offset-xs-1 col-xl-9 offset-xl-2">
                  {this.props.children}
                </div>
              </div>
            </div>
            <div className="col-sm-12 order-md-1 col-lg-7 no-padding">
              <Carousel interval={3000} controls={false} indicators>
                {signupSlides.map((item, i) => (
                  <Carousel.Item key={i}>
                    <img
                      className="d-block w-100"
                      src={item.img}
                      alt="First slide"
                    />
                    <Carousel.Caption>
                      <div className="row mb-5">
                        <div className="col-sm-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                          <p>{item.text}</p>
                          <br />
                          <p>
                            <img
                              className=""
                              src={captionImage}
                              alt="First slide"
                            />
                          </p>
                          <p className="no-margin">Kathy Miller</p>
                          <p className="no-margin small small-xs color-faded-white">
                            LETS Merchant
                          </p>
                        </div>
                      </div>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Login;
