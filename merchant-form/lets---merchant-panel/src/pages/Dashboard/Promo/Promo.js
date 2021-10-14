import React, { useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./addPromo.css";
import calendar from "../../../assets/images/icon/calendar.svg";
import dayjs from "dayjs";
import { validateNums } from "../../../helpers/validateNums";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";

//Components
import Title from "../../../components/Dashboard/Title/Title";
import FormInputEdit from "../../../components/Dashboard/FormInput/FormInputEdit";
//redux
import { useSelector, useDispatch } from "react-redux";
import {
  addPromo,
  editPromo,
  deletePromos,
} from "../../../redux/actions/dataActions";
import DeletePopup from "../../../components/Dashboard/Popup/DeletePopup";
import CustomSnackbar from "../../../components/Dashboard/Snackbar/CustomSnackbar";

function Promo({ type }) {
  const dispatch = useDispatch();
  const { promos, loading } = useSelector((state) => state.data);
  const history = useHistory();
  const slug = useParams();
  const [open, setOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("delete");
  const [openCustomUsage, setOpenCustomUsage] = useState(false);
  const [customUsage, setCustomUsage] = useState("0");
  const usageRef = useRef(null);
  const endDateRef = useRef();
  const startDateRef = useRef();
  const [promoDetails, setPromoDetails] = useState({
    id: "",
    promo_code: "",
    promo: "",
    percentage: 0,
    start_date: "",
    end_date: "",
    usage: 1,
    status: "active",
    type: "",
    count: 0,
    amount: 0,
    promo_amount: 0,
  });
  useEffect(() => {
    setOpenCustomUsage(false);
    if (slug.id) {
      const findPromo = promos.find((item) => item.id.toString() === slug.id);
      setPromoDetails({
        ...findPromo,
        start_date: dayjs(findPromo?.start_date).format("MM/DD/YYYY"),
        end_date: dayjs(findPromo?.end_date).format("MM/DD/YYYY"),
      });
    }
  }, [promos, slug.id]);
  useEffect(() => {
    if (openCustomUsage) {
      usageRef.current.focus();
    }
    if (promoDetails.usage === "Custom") {
      setOpenCustomUsage(true);
    } else {
      if (openCustomUsage) {
        setOpenCustomUsage(false);
        setCustomUsage("");
      }
    }
  }, [openCustomUsage, promoDetails.usage]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromoDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let status;
    if (
      new Date(promoDetails.end_date).toISOString() > new Date().toISOString()
    ) {
      status = "expired";
    }
    if (type === "add") {
      dispatch(
        addPromo(
          {
            ...promoDetails,
            usage: customUsage ? customUsage : promoDetails.usage,
            status: status ? status : promoDetails.status,
          },
          history
        )
      );
    } else if (type === "edit") {
      dispatch(
        editPromo({
          promo_id: promoDetails.id,
          ...promoDetails,
          usage: customUsage ? customUsage : promoDetails.usage,
          status: status ? status : promoDetails.status,
        })
      ).then((res) => {
        if (res) {
          setShowSnackbar(true);
          setSnackbarType("edit");
          history.push(`/promo/view/${promoDetails.id}`);
        }
      });
    } else {
      return;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirmDelete = () => {
    dispatch(deletePromos([promoDetails.id])).then((res) => {
      if (res) {
        setShowSnackbar(true);
        setSnackbarType("delete");
        history.push("/products");
      }
    });
    handleClose();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="dash-box">
        <Title
          id={promoDetails?.id}
          type={type}
          page="promo"
          setOpen={setOpen}
          loading={loading}
        />
        <div className="row mt-4">
          <div className="col-xs-12 col-md-4">
            <FormInputEdit
              text="Promo Code"
              type={type}
              className="form-control"
              inputType="text"
              placeholder="Enter Promo Code"
              value={promoDetails?.promo_code}
              name="promo_code"
              onChange={handleChange}
            />
          </div>
          <div className="col-xs-12 col-md-4">
            <FormInputEdit
              text="Promo Name"
              type={type}
              name="promo"
              className="form-control"
              inputType="text"
              placeholder="Enter Promo Name"
              value={promoDetails?.promo}
              onChange={handleChange}
            />
          </div>
          <div className="col-xs-12 col-md-4">
            <div className="form-group">
              <label className="color-faded-black">Promo Type</label>
              <Dropdown>
                <Dropdown.Toggle
                  variant="default"
                  className="form-control dropdown-toggle dropdown-toggle-violet text-left"
                  disabled={type === "view" ? true : loading}
                  value="In stock"
                  style={{
                    color: "#3c397c",
                    opacity: promoDetails.type ? "1" : ".6",
                  }}
                >
                  {promoDetails.type ? promoDetails.type : "Enter Promo Type"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      setPromoDetails((prevState) => ({
                        ...prevState,
                        type: "Percentage Discount",
                      }))
                    }
                  >
                    Percentage Discount
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      setPromoDetails((prevState) => ({
                        ...prevState,
                        type: "Free",
                      }))
                    }
                  >
                    Free
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-4 d-flex">
            <div className="form-group mr-3">
              <label className="color-faded-black">Start Date</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <img
                      src={calendar}
                      alt=""
                      onClick={() => startDateRef.current.setOpen(true)}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                </div>
                {type === "view" ? (
                  <input
                    className="form-control"
                    type="text"
                    disabled
                    value={promoDetails?.start_date}
                  />
                ) : (
                  <DatePicker
                    ref={startDateRef}
                    onChange={(date) =>
                      setPromoDetails((prevState) => ({
                        ...prevState,
                        start_date: date,
                      }))
                    }
                    className="form-control"
                    selected={
                      promoDetails?.start_date
                        ? new Date(promoDetails?.start_date)
                        : promoDetails?.start_date
                    }
                    placeholderText="Select Start Date"
                  />
                )}
              </div>
            </div>
            <div className="form-group">
              <label className="color-faded-black">End Date</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <img
                      src={calendar}
                      alt=""
                      onClick={() => endDateRef.current.setOpen(true)}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                </div>
                {type === "view" ? (
                  <input
                    className="form-control"
                    type="text"
                    disabled
                    value={promoDetails.end_date}
                  />
                ) : (
                  <DatePicker
                    ref={endDateRef}
                    onChange={(date) =>
                      setPromoDetails((prevState) => ({
                        ...prevState,
                        end_date: date,
                      }))
                    }
                    className="form-control"
                    selected={
                      promoDetails?.end_date
                        ? new Date(promoDetails?.end_date)
                        : promoDetails?.end_date
                    }
                    placeholderText="Select End Date"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-4">
            <div className="form-group">
              <label className="color-faded-black">Usage/Limit</label>
              <select
                className="custom-select"
                name="usage"
                onChange={handleChange}
                value={promoDetails?.usage}
                disabled={type === "view"}
              >
                {type === "view" && (
                  <option vale="">{promoDetails?.usage}</option>
                )}
                <option value={1}>Use once</option>
                <option value={999999}>Unlimited usage</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            {openCustomUsage && (
              <div className="form-group">
                <input
                  className="form-control"
                  type="number"
                  name="usage"
                  value={customUsage}
                  onChange={(e) => setCustomUsage(e.target.value)}
                  ref={usageRef}
                  onKeyPress={validateNums}
                />
              </div>
            )}
          </div>
          <div className="col-xs-12 col-md-4">
            {promoDetails.type === "Percentage Discount" && (
              <div className="form-group">
                <label className="color-faded-black">Amount</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">%</span>
                  </div>
                  <input
                    type="number"
                    name="percentage"
                    className="form-control no-arrow"
                    placeholder="Enter Percentage Discount"
                    value={promoDetails?.percentage}
                    onChange={handleChange}
                    disabled={type === "view"}
                    onKeyPress={validateNums}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <DeletePopup
        open={open}
        item="promo"
        handleClose={handleClose}
        confirmDelete={confirmDelete}
      />
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => setShowSnackbar(false)}
        type={snackbarType}
        message={
          snackbarType === "delete"
            ? "Promo Successfully Deleted"
            : "Changes Successfully Saved!"
        }
      />
    </form>
  );
}

export default Promo;
