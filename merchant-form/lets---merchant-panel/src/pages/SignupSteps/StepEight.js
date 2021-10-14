import React from "react";
import StoreMenu from "../../components/Dashboard/Store/StoreMenu/StoreMenu";
import Stepper from "../../components/Stepper/Stepper";
import withWidth from "@material-ui/core/withWidth";

const StepEight = ({
  data,
  handleBack,
  products,
  setProducts,
  items,
  setItems,
  handleSubmit,
  classes,
  width,
}) => {
  return (
    <div className={classes.stepContainer}>
      <StoreMenu
        products={products}
        setProducts={setProducts}
        items={items}
        setItems={setItems}
      />
      <Stepper
        steps={8}
        activeStep={data?.steps}
        handleNext={handleSubmit}
        handleBack={handleBack}
        nextText={width === "xs" || width === "sm" ? "Submit" : "Get started"}
        loading={data.loading}
      />
    </div>
  );
};

export default withWidth()(StepEight);
