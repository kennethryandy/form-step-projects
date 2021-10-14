import React, { useState } from "react";
//Mui
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import RedoIcon from "@material-ui/icons/Redo";

function PromoFilters({
  classes,
  promos,
  selectedStatus,
  filterStatus,
  resetFilters,
  loading,
  setData,
  status
}) {
  const [discount, setDiscount] = useState(["Free", "Percentage Discount"]);
  const [selectedDiscount, setSelectedDiscount] = useState("")

  // useEffect(() => {
  //   const set = new Set(promos?.map((promo) => promo.percentage));
  //   setDiscount([...set]);
  // }, [promos]);

  const filterPercent = (percent) => {
    if(selectedDiscount === percent){
      setSelectedDiscount("")
      if(status){
        const newPromo = promos.filter(promo => promo.status === status)
        setData(newPromo)
      }else{
        setData(promos)
      }
    }else {
      setSelectedDiscount(percent)
      if(status){
        const newPromo = promos.filter(promo => percent === "Free" ? (promo.percentage === "0.00" && promo.status === status) : (parseInt(promo.percentage) > 1  && promo.status === status))
        setData(newPromo)
      }else{
        const newPromo = promos.filter(promo => percent === "Free" ? promo.percentage === "0.00" : parseInt(promo.percentage) > 1)
        setData(newPromo)
      }
    }
  }

  const reset = () => {
    resetFilters()
    setSelectedDiscount("")
  }

  return (
    <div>
      <div className="dash-box-rowborder py-4">
        <Typography variant="body1" align="center" color="textSecondary">
          Filter Search
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3">
        <Typography variant="body1" align="center" color="textSecondary">
          Status
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3 d-flex flex-column">
        <Button
          className={classes.filterBtn}
          variant={selectedStatus === "active" ? "contained" : "outlined"}
          color={selectedStatus === "active" ? "secondary" : "default"}
          onClick={() => filterStatus("active")}
          disabled={loading}
          style={{
            border:
              selectedStatus === "active"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
        >
          active
        </Button>
        <Button
          variant={selectedStatus === "in-active" ? "contained" : "outlined"}
          color={selectedStatus === "in-active" ? "secondary" : "default"}
          style={{
            border:
              selectedStatus === "in-active"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
          className={classes.filterBtn}
          onClick={() => filterStatus("in-active")}
          disabled={loading}
        >
          in-active
        </Button>
        <Button
          variant={selectedStatus === "expired" ? "contained" : "outlined"}
          color={selectedStatus === "expired" ? "secondary" : "default"}
          style={{
            border:
              selectedStatus === "expired"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
          className={classes.filterBtn}
          onClick={() => filterStatus("expired")}
          disabled={loading}
        >
          Expired
        </Button>
      </div>
      <div className="dash-box-rowborder py-3">
        <Typography variant="body1" align="center" color="textSecondary">
          Promo Type
        </Typography>
      </div>
      <div className="dash-box-rowborder py-3 d-flex flex-column">
        {discount?.map((percent, i) => (
          <Button
            key={i}
            variant="text"
            className={`${selectedDiscount === percent ? "filter-active" : ""} ${
              classes.filterBtn
            }`}
            onClick={() => filterPercent(percent)}
          >
            <Typography
              variant="subtitle2"
              color={selectedDiscount === percent ? "inherit" : "textSecondary"}
            >
              {percent}
            </Typography>
          </Button>
        ))}
      </div>
      <div className="dash-box-rowborder py-3 d-flex align-items-center justify-content-center">
        <Button
          color="primary"
          className={classes.filterBtn}
          endIcon={<RedoIcon />}
          onClick={reset}
          style={{ paddingLeft: 20 }}
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
}

export default PromoFilters;
