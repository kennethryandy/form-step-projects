import React, { useState } from "react";
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
  nextStep,
  prevStep,
  sendData,
} from "../../redux/actions/registerAction";
//Mui
import { makeStyles } from "@material-ui/core/styles";
//Components
import Login from "../../templates/Login";
import Signup from "./Signup";
import StepTwo from "../SignupSteps/StepTwo";
import BusinessTitle from "./BusinessTitle";
import StepThree from "../SignupSteps/StepThree";
import StepFour from "../SignupSteps/StepFour";
import StepFive from "../SignupSteps/StepFive";
import StepSix from "../SignupSteps/StepSix";
import StepSeven from "../SignupSteps/StepSeven";
import StepEight from "../SignupSteps/StepEight";

const useStyles = makeStyles((theme) => ({
  stepContainer: {
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(4),
    },
  },
  signupHeaderWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(5),
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "start",
      marginBottom: 0,
      "& img": {
        marginBottom: theme.spacing(2),
      },
    },
  },
  businessTitle: {
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      textAlign: "left",
    },
  },
  signUpHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(5),
    textAlign: "center",
    "& h1": {
      textTransform: "uppercase",
      margin: 0,
      color: "#000",
    },
    [theme.breakpoints.down("sm")]: {
      textAlign: "left",
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      justifyContent: "start",
    },
  },
  backdrop: {
    zIndex: "10000 !important",
    color: "#fff",
  },
  formGroup: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    "& img": {
      width: "100%",
      height: "100%",
      borderRadius: 10,
      border: "1.6px solid #DFE8F1",
      cursor: "pointer",
      [theme.breakpoints.only("xs")]: {
        width: 128,
        minWidth: 128,
        maxHeight: 128,
        minHeight: 128,
      },
    },
  },
  customDropDown: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1.6px solid #d1d3e2",
    borderRadius: 6,
    padding: "4.5px 10px",
    background: "#f4f4f8",
    margin: `${theme.spacing(2)}px 0px`,
    position: "relative",
    "& svg": { cursor: "pointer" },
    "& input": {
      padding: "5px",
      border: "none",
      fontSize: "1rem",
      fontWeight: 400,
      color: "#3c397c",
      background: "none",
      "&:focus": {
        outline: "none",
      },
      "&::placeholder": {
        color: "#3c397c",
        opacity: "0.5",
      },
    },
  },
  fileForm: {
    width: 240,
    height: 240,
    "& img": {
      width: 240,
      height: 240,
      minWidth: 240,
      minHeight: 240,
      maxWidth: 240,
      maxHeight: 240,
    },
  },
  timeContainer: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  hoursLabelCheckbox: {
    "& span:last-child": {
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
  hourList: {
    maxHeight: 200,
    zIndex: 999,
    width: "100%",
    position: "absolute",
    overflowY: "scroll",
    borderRadius: 4,
    padding: 0,
    top: 42,
    left: 0,
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
  },
  dayHours: {
    display: "flex",
    marginBottom: theme.spacing(2),
    "&>div": {
      display: "flex",
    },
  },
  hoursLabel: {
    width: 95,
  },
}));

const Index = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const registerSteps = useSelector((state) => state.registerSteps);
  const [isCredValid, setIsCredValid] = useState({
    username: false,
    email: false,
  });
  const [infos, setInfos] = useState({
    store_name: "",
    location_full_address: "",
    place_id: "",
    store_description: "",
    phone_number: "",
    landline_number: "",
    // category: [],
  });
  const [errors, setErrors] = useState({
    errorLocation: "",
    store_name: "",
    category: "",
    store_description: "",
  });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handleSubmit = () => {
    dispatch(sendData(infos, products));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }
  };

  switch (registerSteps.steps) {
    case 1:
      return (
        <Login page="sign-up">
          <Signup
            data={registerSteps}
            handleBack={handleBack}
            handleNext={handleNext}
            isCredValid={isCredValid}
            setIsCredValid={setIsCredValid}
            classes={classes}
          />
        </Login>
      );
    case 2:
      return (
        <Login page="sign-up">
          <BusinessTitle classes={classes} />
          <StepTwo
            infos={infos}
            setInfos={setInfos}
            errors={errors}
            setErrors={setErrors}
            data={registerSteps}
            handleBack={handleBack}
            handleChange={handleChange}
            handleNext={handleNext}
            classes={classes}
          />
        </Login>
      );
    case 3:
      return (
        <Login page="sign-up">
          <BusinessTitle classes={classes} />
          <StepThree
            data={registerSteps}
            classes={classes}
            handleBack={handleBack}
            handleNext={handleNext}
            file={file}
            setFile={setFile}
            progress={progress}
            setProgress={setProgress}
            setInfos={setInfos}
            infos={infos}
          />
        </Login>
      );
    case 4:
      return (
        <Login page="sign-up">
          <BusinessTitle classes={classes} />
          <StepFour
            classes={classes}
            infos={infos}
            setInfos={setInfos}
            errors={errors}
            setErrors={setErrors}
            data={registerSteps}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        </Login>
      );
    case 5:
      return (
        <Login page="sign-up">
          <BusinessTitle classes={classes} />
          <StepFive
            classes={classes}
            infos={infos}
            setInfos={setInfos}
            errors={errors}
            setErrors={setErrors}
            data={registerSteps}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        </Login>
      );
    case 6:
      return (
        <Login page="sign-up">
          <BusinessTitle classes={classes} />
          <StepSix
            data={registerSteps}
            handleNext={handleNext}
            handleBack={handleBack}
            infos={infos}
            setInfos={setInfos}
            setErrors={setErrors}
            errors={errors}
            handleChange={handleChange}
            classes={classes}
          />
        </Login>
      );
    case 7:
      return (
        <Login page="sign-up">
          <BusinessTitle classes={classes} />
          <StepSeven
            data={registerSteps}
            handleNext={handleNext}
            handleBack={handleBack}
            infos={infos}
            errors={errors}
            setErrors={setErrors}
            handleChange={handleChange}
            classes={classes}
          />
        </Login>
      );
    case 8:
      return (
        <Login page="sign-up">
          <BusinessTitle classes={classes} />
          <StepEight
            data={registerSteps}
            handleBack={handleBack}
            products={products}
            setProducts={setProducts}
            items={items}
            setItems={setItems}
            handleSubmit={handleSubmit}
            classes={classes}
          />
        </Login>
      );
    default:
      return null;
  }
};

export default Index;
