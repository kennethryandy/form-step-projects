export const time12to24hours = (time) => {
  if (!time) return;
  let H = +time?.substr(0, 2);
  let h = H % 12 || 12;
  let ampm = H < 12 || H === 24 ? "AM" : "PM";
  time =
    h < 10
      ? "0" + h + time.substr(2, 3) + " " + ampm
      : h + time.substr(2, 3) + " " + ampm;
  return time;
};

export const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};
