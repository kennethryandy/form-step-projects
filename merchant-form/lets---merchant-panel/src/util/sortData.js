import { convertTime12to24 } from "../helpers/timeConverter";
export default (data) => {
  let opening_hours = {};
  let store_hours = {};
  if (data.monday_store_hours_start) {
    opening_hours = {
      ...opening_hours,
      monday_store_hours_start: convertTime12to24(
        data.monday_store_hours_start
      ),
    };
  }
  if (data.tuesday_store_hours_start) {
    opening_hours = {
      ...opening_hours,
      tuesday_store_hours_start: convertTime12to24(
        data.tuesday_store_hours_start
      ),
    };
  }
  if (data.wednesday_store_hours_start) {
    opening_hours = {
      ...opening_hours,
      wednesday_store_hours_start: convertTime12to24(
        data.wednesday_store_hours_start
      ),
    };
  }
  if (data.thursday_store_hours_start) {
    opening_hours = {
      ...opening_hours,
      thursday_store_hours_start: convertTime12to24(
        data.thursday_store_hours_start
      ),
    };
  }
  if (data.friday_store_hours_start) {
    opening_hours = {
      ...opening_hours,
      friday_store_hours_start: convertTime12to24(
        data.friday_store_hours_start
      ),
    };
  }
  if (data.saturday_store_hours_start) {
    opening_hours = {
      ...opening_hours,
      saturday_store_hours_start: convertTime12to24(
        data.saturday_store_hours_start
      ),
    };
  }
  if (data.sunday_store_hours_start) {
    opening_hours = {
      ...opening_hours,
      sunday_store_hours_start: convertTime12to24(
        data.sunday_store_hours_start
      ),
    };
  }
  if (data.monday_store_hours_end) {
    opening_hours = {
      ...opening_hours,
      monday_store_hours_end: convertTime12to24(data.monday_store_hours_end),
    };
  }
  if (data.tuesday_store_hours_end) {
    opening_hours = {
      ...opening_hours,
      tuesday_store_hours_end: convertTime12to24(data.tuesday_store_hours_end),
    };
  }
  if (data.wednesday_store_hours_end) {
    opening_hours = {
      ...opening_hours,
      wednesday_store_hours_end: convertTime12to24(
        data.wednesday_store_hours_end
      ),
    };
  }
  if (data.thursday_store_hours_end) {
    opening_hours = {
      ...opening_hours,
      thursday_store_hours_end: convertTime12to24(
        data.thursday_store_hours_end
      ),
    };
  }
  if (data.friday_store_hours_end) {
    opening_hours = {
      ...opening_hours,
      friday_store_hours_end: convertTime12to24(data.friday_store_hours_end),
    };
  }
  if (data.saturday_store_hours_end) {
    opening_hours = {
      ...opening_hours,
      saturday_store_hours_end: convertTime12to24(
        data.saturday_store_hours_end
      ),
    };
  }
  if (data.sunday_store_hours_end) {
    opening_hours = {
      ...opening_hours,
      sunday_store_hours_end: convertTime12to24(data.sunday_store_hours_end),
    };
  }
  const start = convertTime12to24(data.store_hours_start);
  const end = convertTime12to24(data.store_hours_end);

  if (data.store_hours_start && !start.includes("undefined")) {
    store_hours = {
      ...store_hours,
      store_hours_start: convertTime12to24(data.store_hours_start),
    };
  } else {
    store_hours = {
      store_hours_start: "00:00",
      store_hours_end: "00:00",
    };
  }
  if (data.store_hours_end && !end.includes("undefined")) {
    store_hours = {
      ...store_hours,
      store_hours_end: convertTime12to24(data.store_hours_end),
    };
  } else {
    store_hours = {
      store_hours_start: "00:00",
      store_hours_end: "00:00",
    };
  }

  const phone_number = data.phone_number.replace(/[^0-9]+/g, "");
  const category =
    typeof data.category === "string" ? data.category : data.category.join();
  const newData = {
    ...opening_hours,
    ...store_hours,
    store_logo_file_id: data.store_logo_file_id,
    store_name: data.store_name,
    email: data.email,
    phone_number,
    location_full_address: data.location_full_address,
    category,
    place_id: data.place_id,
    landline_number: data.landline_number,
    store_description: data.store_description,
    lat: data.location_lat,
    lng: data.location_lng,
  };
  return newData;
};
