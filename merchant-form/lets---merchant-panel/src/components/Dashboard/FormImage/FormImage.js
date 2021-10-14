import React, { Component } from "react";
import { isImageLarge } from "../../../helpers/isImageLarge";
import defaultImage from "./../../../assets/images/icon/file-upload.svg";
import noProductImage from "../../../assets/images/no-product.png";

class FormImage extends Component {
  state = {
    orig_file: require("./../../../assets/images/icon/file-upload.svg"),
    file: {},
  };

  handleChange(event, index) {
    event.persist();
    const formData = new FormData();
    const tempFile = event.target.files[0].name.split(".");
    const isGif = tempFile[tempFile.length - 1];
    if (isGif.toLowerCase() === "gif") {
      return;
    }
    if (isImageLarge(event.target.files[0])) {
      return;
    }
    try {
      this.setState({
        file: {
          ...this.state.file,
          [index]: URL.createObjectURL(event.target.files[0]),
        },
      });
      if (this.props.limit === "1") {
        formData.append(
          "file",
          event.target.files[0],
          event.target.files[0].name
        );
        this.props.setImage(formData);
      } else {
        formData.append(
          "file",
          event.target.files[0],
          event.target.files[0].name
        );
        this.props.setImage((prevState) => ({
          ...prevState,
          [event.target.name]: formData,
        }));
      }
    } catch (e) {}
  }
  addDefaultSrc = (e) => {
    e.target.src = defaultImage;
  };
  render() {
    const {
      type,
      value,
      name,
      text,
      limit,
      loading,
      className,
      height,
    } = this.props;
    const Img = () => {
      if (type === "add" || type === "edit") {
        return (
          <div
            className="row"
            style={{ flex: 1, minHeight: height ? height : 240 }}
          >
            {[...Array(parseInt(limit))].map((a, i) => {
              return (
                <div
                  key={i}
                  className={"col-xs-12 col-md-" + 12 / parseInt(limit)}
                  style={{ height: height ? height : 240, padding: 0 }}
                >
                  <div className="form-group h-100">
                    <div className="file-upload h-100">
                      <input
                        type="file"
                        name={`${name}${i + 1}_id`}
                        accept="image/*"
                        onChange={(e) => this.handleChange(e, i)}
                        disabled={loading}
                      />
                      <span
                        className={
                          "file h-100" +
                          (this.state.file[i] || value[i] ? " active" : "")
                        }
                      >
                        <img
                          src={
                            this.state.file[i]
                              ? this.state.file[i]
                              : value[i]
                              ? `https://api.lets.com.ph/2/public/files/${value[i]}`
                              : defaultImage
                          }
                          onError={this.addDefaultSrc}
                          style={{
                            border: value[i]
                              ? "1px solid rgb(133, 135, 150)"
                              : "none",
                            borderRadius: 12,
                            margin: "auto",
                            height:
                              this.state.file[i] || value[i]
                                ? height
                                  ? height
                                  : 240
                                : "auto",
                            minHeight: this.state.file[i]
                              ? height
                                ? height
                                : 240
                              : "",
                            width: this.state.file[i] || value[i] ? "100%" : "",
                          }}
                          alt=""
                        />
                        <span className="btn-replace btn">Replace Image</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      } else {
        return (
          <div
            className="row"
            style={{ flex: 1, minHeight: height ? height : 240 }}
          >
            {value.length > 0 ? (
              value.map(
                (a, i) =>
                  a && (
                    <div
                      key={i}
                      className={"col-xs-12 col-md-" + 12 / parseInt(limit)}
                      style={{ height: height ? height : 240 }}
                    >
                      <div className="form-group h-100">
                        <div className="file-upload h-100">
                          <span
                            className="file active view no-bg h-100"
                            style={{
                              border: "1px solid rgb(133, 135, 150)",
                              borderRadius: 12,
                            }}
                          >
                            <img
                              src={
                                value[i]
                                  ? `https://api.lets.com.ph/2/public/files/${value[i]}`
                                  : defaultImage
                              }
                              style={{
                                margin: "auto",
                                height: value[i]
                                  ? height
                                    ? height
                                    : 240
                                  : "auto",
                                minHeight: value[i]
                                  ? height
                                    ? height
                                    : 240
                                  : "",
                                width: value[i] ? "100%" : "",
                              }}
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  )
              )
            ) : (
              <div
                className={"col-xs-12 col-md-" + 12 / parseInt(limit)}
                style={{ height: height ? height : 240 }}
              >
                <div className="form-group h-100">
                  <div className="file-upload h-100">
                    <span
                      className="file view no-bg h-100"
                      style={{
                        border: "1px solid rgba(133, 135, 150, .3)",
                        borderRadius: 12,
                      }}
                    >
                      <img
                        src={noProductImage}
                        style={{
                          margin: "auto",
                          height: 160,
                          minHeight: 160,
                          width: "100%",
                          objectFit: "contain",
                        }}
                        alt=""
                      />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
    };

    return (
      <div className="d-flex flex-column h-100">
        {text && (
          <div className="row">
            <div className={`col-xs-12 col-md-4 ${className ? className : ""}`}>
              <label
                className={
                  this.props.styles ? this.props.styles : "color-faded-black"
                }
              >
                {text}
              </label>
            </div>
          </div>
        )}

        <Img />
      </div>
    );
  }
}

export default FormImage;
