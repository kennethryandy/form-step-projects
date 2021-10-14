import React, { useEffect, useState } from "react";
import storeIcon from "../../../assets/images/icon/store-icon.svg";
import { useSelector } from "react-redux";
import "./sidebar.css";
import { Link } from "react-router-dom";
import Collapse from "react-bootstrap/Collapse";

const Sidebar = ({ page }) => {
  const user = useSelector((state) => state.user.storeProfile);
  const [open, setOpen] = useState(
    page?.includes("product") || page === "category" ? true : false
  );
  const [noImg, setNoImg] = useState(false);
  const [activeLinks, setActiveLinks] = useState({
    dashboard: "",
    product: "",
    order: "",
    customer: "",
    wallet: "",
    promo: "",
    store: "",
  });
  useEffect(() => {
    switch (page) {
      case "dashboard":
        setActiveLinks({ dashboard: "active" });
        break;
      case "orders":
        setActiveLinks({ order: "active" });
        break;
      case "products":
      case "new_product":
      case "category":
        setActiveLinks({ product: "active" });
        break;
      case "customers":
        setActiveLinks({ customer: "active" });
        break;
      case "wallet":
        setActiveLinks({ wallet: "active" });
        break;
      case "promos":
        setActiveLinks({ promo: "active" });
        break;
      case "store":
        setActiveLinks({ store: "active" });
        break;
      default:
        break;
    }
  }, [page]);

  const addDefaultSrc = (e) => {
    e.target.src = storeIcon;
    setNoImg(true);
  };

  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <Link
        className="sidebar-brand d-flex align-items-center justify-content-center"
        to="/"
      >
        <div className="sidebar-brand-icon">
          <img
            alt="Lets"
            className="img-responsive"
            src={require("./../../../assets/images/logo.png")}
          />
        </div>
      </Link>

      <div className="sidebar-profile">
        <div className="sidebar-profile-profile">
          <span className="sidebar-profile-img">
            {user.store_logo_file_id ? (
              <img
                src={`https://api.lets.com.ph/2/public/files/${user?.store_logo_file_id}/`}
                onError={addDefaultSrc}
                alt={user.store_name}
                style={{
                  objectFit: noImg ? "contain" : "cover",
                  backgroundColor: noImg ? "#d1d3e2" : "transparent",
                  padding: noImg ? 4 : 0,
                }}
              />
            ) : (
              <img
                src={storeIcon}
                alt={user.store_name}
                style={{
                  objectFit: "contain",
                  backgroundColor: "#d1d3e2",
                  padding: 4,
                }}
              />
            )}
          </span>
          <span className="sidebar-profile-status online"></span>
        </div>
        <div className="sidebar-profile-info">
          {user.username && (
            <p className="no-margin text-capitalize">{user?.username}</p>
          )}
          <p className="small small-xs no-margin sidebar-profile-info-status">
            Online
          </p>
        </div>
      </div>

      {/* <li className={"nav-item " + activeLinks.dashboard}>
        <Link className="nav-link" to="/dashboard">
          <i
            className={`icon icon-dashboard${
              activeLinks.dashboard ? "-active" : ""
            }`}
          ></i>
          <span>Dashboard</span>
        </Link>
      </li> */}

      <li className={"nav-item " + activeLinks.order}>
        <Link className="nav-link" to="/orders">
          <i
            className={`icon icon-list${activeLinks.order ? "-active" : ""}`}
          ></i>
          <span>Order</span>
        </Link>
      </li>

      <li className="nav-item">
        <button
          className={`nav-link collapsed ${open ? "open" : ""}`}
          data-toggle="collapse"
          aria-controls="product-collapse"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <i
            className={`icon icon-product${
              activeLinks.product ? "-" + activeLinks.product : ""
            }`}
          ></i>
          <span className="product-span">Product</span>
        </button>
      </li>
      <Collapse in={open}>
        <div id="product-collapse">
          <div className="collapse-inner collapse-item">
            <li className="nav-item">
              <Link
                className={`collapse-item nav-link ${
                  page === "new_product" && "active"
                }`}
                to="/product/add"
              >
                <span
                  className={
                    page !== "new_product" ? "color-faded-white" : "active"
                  }
                >
                  Add New
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`collapse-item nav-link ${
                  page === "products" && "active"
                }`}
                to="/products"
              >
                <span
                  className={page !== "products" ? "color-faded-white" : ""}
                >
                  All Products
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`collapse-item nav-link ${
                  page === "category" && "active"
                }`}
                to="/product/categories"
              >
                <span
                  className={page !== "category" ? "color-faded-white" : ""}
                >
                  Product Categories
                </span>
              </Link>
            </li>
          </div>
        </div>
      </Collapse>

      <li className={"nav-item " + activeLinks.customer}>
        <Link className="nav-link" to="/customers">
          <i
            className={`icon icon-user${activeLinks.customer ? "-active" : ""}`}
          />
          <span>Customer</span>
        </Link>
      </li>

      {/* <li className={"nav-item " + activeLinks.wallet}>
            <Link className="nav-link" to="/wallet">
              <i
                className={`icon icon-wallet${
                  activeLinks.wallet ? "-active" : ""
                }`}
              ></i>
              <span>Wallet</span>
            </Link>
          </li> */}

      {/* <li className={"nav-item " + activeLinks.promo}>
            <Link className="nav-link" to="/promos">
              <i
                className={`icon icon-tag${activeLinks.promo ? "-active" : ""}`}
              />
              <span>Promo</span>
            </Link>
          </li> */}

      <li className={"nav-item " + activeLinks.store}>
        <Link className="nav-link" to="/store">
          <i
            className={`icon icon-shop${activeLinks.store ? "-active" : ""}`}
          ></i>
          <span>Store Profile</span>
        </Link>
      </li>
    </ul>
  );
};

export default Sidebar;
