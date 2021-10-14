import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import sortData from "../../../util/sortData";
// import storeValidationSchema from "../../../config/storeValidation";
import phLogo from "../../../assets/images/icon/ph.webp";
import { time12to24hours } from "../../../helpers/timeConverter";
import { validateNums } from "../../../helpers/validateNums";
import { validateDailyHours } from "../../../config/storeValidation";
//Components
import StoreHead from "./StoreHead";
import StoreCategory from "../../../components/Dashboard/Store/StoreCategory";
import StoreHours from "../../../components/Dashboard/Store/StoreHours";
// import FormImage from "../../../components/Dashboard/FormImage";
import FormImage2 from "../../../components/Dashboard/FormImage/FormImage2";
import StoreProfileSkeleton from "../../../components/Skeleton/StoreProfileSkeleton";
import GoogleMap from "../../../components/Dashboard/Store/Maps/Map";
import InfoPopup from "../../../components/Dashboard/Popup/InfoPopup";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { editStore, uploadStoreLogo } from "../../../redux/actions/userAction";
//Mui
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import useStyles from "./storeStyle";
import CustomBadge from "../../../components/Badge/CustomBadge";

const EditStore = ({ type }) => {
  const classes = useStyles();
  const { storeProfile, loading, showSnackbar } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const [errorLocation, setErrorLocation] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infos, setInfos] = useState({
    location_full_address: "",
  });
  const [storeLogo, setStoreLogo] = useState(null);
  const [isErrorDayHours, setIsErrorDayHours] = useState(false);
  const [errorDayHours, setErrorDayHours] = useState({});
  const [updateWarningPopup, setUpdateWarningPopup] = useState(false);

  const handleCancel = () => {
    setUpdateWarningPopup(false);
  };

  useEffect(() => {
    let store_hours_start = "";
    let store_hours_end = "";
    if (
      !storeProfile.monday_store_hours_start &&
      !storeProfile.tuesday_store_hours_start &&
      !storeProfile.wednesday_store_hours_start &&
      !storeProfile.thursday_store_hours_start &&
      !storeProfile.friday_store_hours_start &&
      !storeProfile.saturday_store_hours_start &&
      !storeProfile.sunday_store_hours_start
    ) {
      store_hours_start = time12to24hours(storeProfile.store_hours_start);
      store_hours_end = time12to24hours(storeProfile.store_hours_end);
    }
    setInfos((prevState) => ({
      ...prevState,
      ...storeProfile,
      store_hours_start,
      store_hours_end,
      monday_store_hours_start: storeProfile.monday_store_hours_start
        ? time12to24hours(storeProfile.monday_store_hours_start)
        : null,
      monday_store_hours_end: storeProfile.monday_store_hours_end
        ? time12to24hours(storeProfile.monday_store_hours_end)
        : null,
      tuesday_store_hours_start: storeProfile.tuesday_store_hours_start
        ? time12to24hours(storeProfile.tuesday_store_hours_start)
        : null,
      tuesday_store_hours_end: storeProfile.tuesday_store_hours_end
        ? time12to24hours(storeProfile.tuesday_store_hours_end)
        : null,
      wednesday_store_hours_start: storeProfile.wednesday_store_hours_start
        ? time12to24hours(storeProfile.wednesday_store_hours_start)
        : null,
      wednesday_store_hours_end: storeProfile.wednesday_store_hours_end
        ? time12to24hours(storeProfile.wednesday_store_hours_end)
        : null,
      thursday_store_hours_start: storeProfile.thursday_store_hours_start
        ? time12to24hours(storeProfile.thursday_store_hours_start)
        : null,
      thursday_store_hours_end: storeProfile.thursday_store_hours_end
        ? time12to24hours(storeProfile.thursday_store_hours_end)
        : null,
      friday_store_hours_start: storeProfile.friday_store_hours_start
        ? time12to24hours(storeProfile.friday_store_hours_start)
        : null,
      friday_store_hours_end: storeProfile.friday_store_hours_end
        ? time12to24hours(storeProfile.friday_store_hours_end)
        : null,
      saturday_store_hours_start: storeProfile.saturday_store_hours_start
        ? time12to24hours(storeProfile.saturday_store_hours_start)
        : null,
      saturday_store_hours_end: storeProfile.saturday_store_hours_end
        ? time12to24hours(storeProfile.saturday_store_hours_end)
        : null,
      sunday_store_hours_start: storeProfile.sunday_store_hours_start
        ? time12to24hours(storeProfile.sunday_store_hours_start)
        : null,
      sunday_store_hours_end: storeProfile.sunday_store_hours_end
        ? time12to24hours(storeProfile.sunday_store_hours_end)
        : null,
    }));
  }, [storeProfile]);

  const handleChange = (e) => {
    setInfos((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTextChange = (e) => {
    setInfos((prevState) => ({
      ...prevState,
      store_description: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    // e.preventDefault();
    const { isError, errorDayHours } = validateDailyHours(infos);
    if ((!infos.store_hours_start || !infos.store_hours_end) && isError) {
      if (isError && Object.keys(errorDayHours).length !== 0) {
        setIsErrorDayHours(isError);
        setErrorDayHours(errorDayHours);
        return setErrors((prevState) => ({
          ...prevState,
          errorTime: "Please complete the store hours.",
        }));
      } else {
        return setErrors((prevState) => ({
          ...prevState,
          errorTime: "Please enter your store hours.",
        }));
      }
    }
    if (!infos.category) {
      return setErrors((prevState) => ({
        ...prevState,
        category: "Please select category for your store.",
      }));
    } else {
      setIsSubmitting(true);
      if (storeProfile.subscription_status === "approved") {
        if (
          storeLogo ||
          infos.store_name !== storeProfile.store_name ||
          infos.email !== storeProfile.email ||
          (infos.location_lat !== storeProfile.location_lat &&
            infos.location_lng !== storeProfile.location_lng)
        ) {
          setUpdateWarningPopup(true);
        } else {
          const storeInfos = sortData(infos);
          updateProfile(storeInfos);
        }
      } else {
        const storeInfos = sortData(infos);
        updateProfile(storeInfos);
      }
      setIsSubmitting(false);
    }
  };

  const submitUpdate = () => {
    const storeInfos = sortData(infos);
    updateProfile(storeInfos);
  };

  const updateProfile = (storeInfos) => {
    if (storeLogo) {
      dispatch(uploadStoreLogo(storeLogo)).then((data) => {
        if (!data.error) {
          dispatch(
            editStore({ ...storeInfos, store_logo_file_id: data.file_id })
          ).then((success) => {
            if (success) {
              dispatch({ type: "SHOW_SNACKBAR" });
            }
          });
        }
      });
    } else {
      dispatch(editStore(storeInfos)).then((success) => {
        if (success) {
          dispatch({ type: "SHOW_SNACKBAR" });
        }
      });
    }
    history.push("/store");
  };

  return !loading && storeProfile.store_name && infos.store_name ? (
    <form onSubmit={handleSubmit}>
      <Paper elevation={0}>
        <StoreHead
          type={type}
          classes={classes}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
        <Grid container style={{ padding: "16px 0px" }}>
          <Grid item md={4} className={classes.gridItem}>
            <FormImage2
              setImage={setStoreLogo}
              loading={isSubmitting}
              setLoading={setIsSubmitting}
              // height={320}
              value={infos.store_logo_file_id}
              height="100%"
              imgHeight="auto"
            />
          </Grid>
          <Grid item md={8} className={classes.gridItem}>
            <div>
              <label className={classes.infoLabel}>Store Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter your store name"
                name="store_name"
                onChange={handleChange}
                value={infos.store_name}
              />
            </div>
            <div style={{ margin: "32px 0px" }}>
              <label>Email Address</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter your email address"
                name="email"
                onChange={handleChange}
                value={infos.email}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: ".5" }}>
                <label>Phone Number</label>
                <InpuNumber
                  infos={infos}
                  setInfos={setInfos}
                  errors={errors}
                  setErrors={setErrors}
                  name="phone_number"
                  type="text"
                  className="form-control"
                  placeholder="+639 828 277 211"
                  onChange={handleChange}
                  value={infos.phone_number}
                />
              </div>
              <div style={{ flex: ".5" }}>
                <label className={classes.infoLabel}>Landline Number</label>
                <InpuNumber
                  infos={infos}
                  setInfos={setInfos}
                  onChange={handleChange}
                  errors={errors}
                  setErrors={setErrors}
                  className="form-control"
                  type="text"
                  placeholder="(123)-123-123"
                  name="landline_number"
                  value={infos.landline_number}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>
      <CustomBadge badgeStyle={{ margin: "20px 0px" }} errors={errors.category}>
        <StoreCategory
          classes={classes}
          infos={infos}
          setInfos={setInfos}
          errors={errors}
          setErrors={setErrors}
        />
      </CustomBadge>
      <CustomBadge
        badgeStyle={{ margin: "20px 0px" }}
        errors={errors.errorTime}
      >
        <StoreHours
          classes={classes}
          infos={infos}
          setInfos={setInfos}
          errorTime={errors.errorTime}
          setErrorTime={setErrors}
          errorDayHours={errorDayHours}
          setErrorDayHours={setErrorDayHours}
          isErrorDayHours={isErrorDayHours}
          edit
        />
      </CustomBadge>
      <Paper elevation={0}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <GoogleMap
              errorLocation={errorLocation}
              setErrorLocation={setErrorLocation}
              infos={infos}
              setInfos={setInfos}
            />
          </Grid>
          <Grid item md={6}>
            <label className={classes.infoLabel}>Store Description</label>
            <textarea
              className="form-control"
              type="text"
              placeholder="Type here..."
              value={infos.store_description}
              onChange={handleTextChange}
              rows={10}
            />
          </Grid>
        </Grid>
      </Paper>
      <InfoPopup
        open={updateWarningPopup}
        title="Edit Confirmation"
        handleClose={handleCancel}
        content="If you wish to edit this, please be informed that this will be needed to be approved by the admin first before publishing to the public."
        update
        submitUpdate={submitUpdate}
      />
    </form>
  ) : (
    <StoreProfileSkeleton />
  );
};

const InpuNumber = ({ infos, setInfos, setErrors, name, ...rest }) => {
  useEffect(() => {
    const phone_number = infos.phone_number;
    if (infos?.phone_number.startsWith("+")) {
      const formattedNumber = phone_number.substring(3);
      setInfos((prevState) => ({
        ...prevState,
        phone_number: formattedNumber,
      }));
    }
    //eslint-disable-next-line
  }, [infos?.phone_number]);

  const handleFocus = (e) => {
    let newValue = e.target.value.replace(/[^0-9]+/g, "");
    setInfos((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleKeyDown = (e) => {
    if (e.target.value.length === 10 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleBlur = (e) => {
    let newValue = e.target.value.replace(/[^0-9]+/g, "");
    let origValue = e.target.value.replace(/[^0-9]+/g, "");
    if (newValue.length > 3) {
      newValue =
        newValue.slice(0, 3) +
        "-" +
        newValue.slice(3, 6) +
        "-" +
        newValue.slice(6);
    }
    if (origValue.length > 9) {
      setErrors((prevState) => ({
        ...prevState,
        phone: "Phone number must at least be 10 digits long.",
      }));
    }
    setInfos((prevState) => ({ ...prevState, [name]: newValue }));
    // field.onBlur(e);
  };

  return (
    <div className="input-group">
      {name === "phone_number" && (
        <div className="input-group-prepend">
          <span className="input-group-text">
            <img src={phLogo} alt="" style={{ width: 30, height: 20 }} />
            <Typography variant="body1" style={{ margin: "0px 8px" }}>
              +63
            </Typography>
          </span>
        </div>
      )}
      <input
        style={{ marginRight: name === "phone_number" ? 24 : 0 }}
        {...rest}
        name={name}
        onKeyDown={handleKeyDown}
        onKeyPress={validateNums}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default EditStore;
