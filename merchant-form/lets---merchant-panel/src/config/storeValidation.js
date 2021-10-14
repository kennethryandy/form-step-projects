import * as yup from "yup";
const schema = yup.object({
  store_name: yup
    .string()
    .required("Please enter a store name.")
    .min(4, "Store name must be at least 4 characters long."),
  email_address: yup
    .string()
    .required("Please enter an email address.")
    .email("Email adress is invalid."),
  phone_number: yup
    .string()
    .required("Please enter a phone number.")
    .test(
      "",
      "Phone number must start with number 9",
      (value) => value?.toString()[0] === "9"
    )
    .test("", "Phone number must be 10 digits long.", (value) => {
      let newValue = value?.toString()?.replace(/[^0-9]+/g, "");
      return newValue?.length >= 10;
    }),
  landline_number: yup
    .string()
    .test("", "Landline number number must be 10 digits long.", (value) => {
      if (value?.toString()?.length > 0) {
        let newValue = value?.toString()?.replace(/[^0-9]+/g, "");
        return newValue?.length >= 10;
      } else {
        return true;
      }
    }),
  category: yup
    .array()
    .of(yup.string().required("Please select category for your store.")),
});

export const validateHours = (store_start, store_ends) => {
  if (store_start && store_ends) {
    return true;
  } else {
    return false;
  }
};

export const validateDailyHours = (data) => {
  let errorDayHours = {};
  let isError = false;
  //monday
  if (!data?.monday_store_hours_start && data?.monday_store_hours_end) {
    errorDayHours = { ...errorDayHours, mondayStart: true };
    isError = true;
  }
  if (data?.monday_store_hours_start && !data?.monday_store_hours_end) {
    errorDayHours = { ...errorDayHours, mondayEnd: true };
    isError = true;
  }
  //tuesday
  if (!data?.tuesday_store_hours_start && data?.tuesday_store_hours_end) {
    errorDayHours = { ...errorDayHours, tuesdayStart: true };
    isError = true;
  }
  if (data?.tuesday_store_hours_start && !data?.tuesday_store_hours_end) {
    errorDayHours = { ...errorDayHours, tuesdayEnd: true };
    isError = true;
  }
  //wednesday
  if (!data?.wednesday_store_hours_start && data?.wednesday_store_hours_end) {
    errorDayHours = {
      ...errorDayHours,
      wednesdayStart: true,
    };
    isError = true;
  }
  if (data?.wednesday_store_hours_start && !data?.wednesday_store_hours_end) {
    errorDayHours = { ...errorDayHours, wednesdayEnd: true };
    isError = true;
  }
  //thursday
  if (!data?.thursday_store_hours_start && data?.thursday_store_hours_end) {
    errorDayHours = {
      ...errorDayHours,
      thursdayStart: true,
    };
    isError = true;
  }
  if (data?.thursday_store_hours_start && !data?.thursday_store_hours_end) {
    errorDayHours = { ...errorDayHours, thursdayEnd: true };
    isError = true;
  }
  //friday
  if (!data?.friday_store_hours_start && data?.friday_store_hours_end) {
    errorDayHours = { ...errorDayHours, fridayStart: true };
    isError = true;
  }
  if (data?.friday_store_hours_start && !data?.friday_store_hours_end) {
    errorDayHours = { ...errorDayHours, fridayEnd: true };
    isError = true;
  }
  //saturday
  if (!data?.saturday_store_hours_start && data?.saturday_store_hours_end) {
    errorDayHours = {
      ...errorDayHours,
      saturdayStart: true,
    };
    isError = true;
  }
  if (data?.saturday_store_hours_start && !data?.saturday_store_hours_end) {
    errorDayHours = { ...errorDayHours, saturdayEnd: true };
    isError = true;
  }
  //sunday
  if (!data?.sunday_store_hours_start && data?.sunday_store_hours_end) {
    errorDayHours = { ...errorDayHours, sundayStart: true };
    isError = true;
  }
  if (data?.sunday_store_hours_start && !data?.sunday_store_hours_end) {
    errorDayHours = { ...errorDayHours, sundayEnd: true };
    isError = true;
  }
  if (
    !data?.monday_store_hours_start &&
    !data?.monday_store_hours_end &&
    !data?.tuesday_store_hours_start &&
    !data?.tuesday_store_hours_end &&
    !data?.wednesday_store_hours_start &&
    !data?.wednesday_store_hours_end &&
    !data?.thursday_store_hours_start &&
    !data?.thursday_store_hours_end &&
    !data?.friday_store_hours_start &&
    !data?.friday_store_hours_end &&
    !data?.saturday_store_hours_start &&
    !data?.saturday_store_hours_end &&
    !data?.sunday_store_hours_start &&
    !data?.sunday_store_hours_end
  ) {
    isError = true;
  }
  return { isError, errorDayHours };
};

export default schema;
