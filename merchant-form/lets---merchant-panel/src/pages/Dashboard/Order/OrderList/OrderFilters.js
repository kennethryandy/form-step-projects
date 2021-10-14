import React, { useState } from "react";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
//Mui
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import RedoIcon from "@material-ui/icons/Redo";
import SvgIcon from "@material-ui/core/SvgIcon";

dayjs.extend(localizedFormat);
const months = [
  { type: "Today", date: new Date() },
  { type: "Yesterday", date: new Date().setDate(new Date().getDate() - 1) },
  { type: "This Month", date: new Date().setMonth(new Date().getMonth()) },
  { type: "Past Month", date: new Date().setMonth(new Date().getMonth() - 1) },
  {
    type: "Past 3 Months",
    date: new Date().setMonth(new Date().getMonth() - 3),
  },
];
const OrderFilter = ({
  classes,
  selectedStatus,
  filterStatus,
  filterDate,
  selectedDate,
  loading,
  resetFilters,
  date,
  setDate,
  setByMonths,
}) => {
  const [isOpenDate, setIsOpenDate] = useState(false);

  const CalendarButton = ({ onClick }) => (
    <IconButton
      size="small"
      onClick={onClick}
      className={`${classes.dateButton} ${date ? "active-date" : ""}`}
    >
      <CustomCalendarIcon
        className={classes.customDate}
        fontSize="small"
        active={date}
      />
    </IconButton>
  );
  const onResetFilter = () => {
    setDate(null);
    resetFilters();
  };
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
          variant={selectedStatus === "processed" ? "contained" : "outlined"}
          color={selectedStatus === "processed" ? "secondary" : "default"}
          onClick={() => filterStatus("processed")}
          disabled={loading}
          style={{
            border:
              selectedStatus === "processed"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
        >
          Completed
        </Button>
        <Button
          variant={selectedStatus === "pending" ? "contained" : "outlined"}
          color={selectedStatus === "pending" ? "secondary" : "default"}
          style={{
            border:
              selectedStatus === "pending"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
          className={classes.filterBtn}
          onClick={() => filterStatus("pending")}
          disabled={loading}
        >
          Pending
        </Button>
        <Button
          variant={
            selectedStatus === "cancelled_by_merchant"
              ? "contained"
              : "outlined"
          }
          color={
            selectedStatus === "cancelled_by_merchant" ? "secondary" : "default"
          }
          style={{
            border:
              selectedStatus === "cancelled_by_merchant"
                ? "1px solid #4BA4FF"
                : "1px solid rgba(0, 0, 0, 0.23)",
          }}
          className={classes.filterBtn}
          onClick={() => filterStatus("cancelled_by_merchant")}
          disabled={loading}
        >
          cancelled
        </Button>
      </div>
      <div className="dash-box-rowborder py-3 d-flex justify-content-between align-items-center">
        <Typography variant="body1" align="center" color="textSecondary">
          {date ? dayjs(date).format("ll") : "Date"}
        </Typography>
        <div>
          <DatePicker
            onChange={(d) => setDate(d)}
            customInput={<CalendarButton />}
            popperPlacement="bottom-end"
            selected={date}
            onCalendarClose={() => setIsOpenDate(false)}
            onCalendarOpen={() => setIsOpenDate(true)}
            yearDropdownItemNumber={30}
            scrollableYearDropdown
            showYearDropdown
          />
        </div>
      </div>
      <div className="dash-box-rowborder py-3 d-flex flex-column">
        {months.map((d, i) => (
          <Button
            key={i}
            variant="text"
            className={`${selectedDate === d.date ? "filter-active" : ""} ${
              classes.filterBtn
            }`}
            onClick={() => {
              filterDate(d.date);
              if (d.type === "Today" || d.type === "Yesterday") {
                console.log("no");
                setByMonths(false);
              } else {
                console.log("YES");
                setByMonths(true);
              }
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              {d.type}
            </Typography>
          </Button>
        ))}
      </div>
      <div className="dash-box-rowborder py-3 d-flex align-items-center justify-content-center">
        <Button
          color="primary"
          className={classes.filterBtn}
          endIcon={<RedoIcon />}
          onClick={onResetFilter}
          style={{ paddingLeft: 20 }}
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
};

const CustomCalendarIcon = ({ active, ...props }) => (
  <SvgIcon {...props}>
    {/* <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="22"
      viewBox="0 0 20 22"
    > */}
    <g transform="translate(-2 -1)">
      <rect
        className={!active ? "b" : "a"}
        width="18"
        height="18"
        rx="2"
        transform="translate(3 4)"
      />
      <line
        className={!active ? "b" : "a"}
        y2="4"
        transform="translate(16 2)"
      />
      <line className={!active ? "b" : "a"} y2="4" transform="translate(8 2)" />
      <line
        className={!active ? "b" : "a"}
        x2="18"
        transform="translate(3 10)"
      />
    </g>
    {/* </svg> */}
  </SvgIcon>
);

export default OrderFilter;
//<defs><style>.a{fill:none;stroke:#ed3c60;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs>
// "react-datepicker": "1.8.0",
