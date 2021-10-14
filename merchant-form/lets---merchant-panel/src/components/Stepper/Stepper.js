import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MobileStepper from "@material-ui/core/MobileStepper";
import CircularProgress from "@material-ui/core/CircularProgress";

const Stepper = withStyles((theme) => ({
  root: {
    "& button": {
      padding: "8px 36px",
      [theme.breakpoints.down("sm")]: {
        padding: "4px 24px",
      },
    },
  },
  dotActive: {
    width: 12,
    height: 12,
  },
  dots: {
    alignItems: "center",
  },
}))(
  ({
    steps,
    activeStep,
    handleNext,
    handleBack,
    nextText,
    disabled,
    loading,
    ...props
  }) => {
    return (
      <MobileStepper
        variant="dots"
        steps={steps}
        position="static"
        activeStep={activeStep - 1}
        className="mt-3 p-0"
        {...props}
        nextButton={
          <Button
            size="large"
            color="primary"
            variant="contained"
            // style={}
            disabled={disabled || loading}
            onClick={handleNext}
          >
            {nextText ? (
              loading ? (
                <CircularProgress disableShrink size={30} />
              ) : (
                nextText
              )
            ) : loading ? (
              <CircularProgress disableShrink size={30} />
            ) : (
              "Next"
            )}
          </Button>
        }
        backButton={
          <Button
            size="large"
            color="primary"
            variant="contained"
            // style={{ padding: "8px 36px" }}
            disabled={activeStep === 1}
            onClick={handleBack}
          >
            Back
          </Button>
        }
      />
    );
  }
);

export default Stepper;
