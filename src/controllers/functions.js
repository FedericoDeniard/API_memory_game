const { v4: uuidv4, validate: validateUUID } = require("uuid");

const validateForm = (form) => {
  const isUUID = (id) => validateUUID(id);
  const isLength = (username) => username.length >= 4 && username.length <= 10;
  const isNumeric = (value) => !isNaN(value);
  const isGreaterThan = (value, min) => value > min;
  const isRecentDate = (date, minutes) =>
    date >= Math.floor(Date.now() / 1000) - minutes * 60;

  const checkId = isUUID(form.id);
  const checkUsername = isLength(form.username);
  const checkTime =
    isNumeric(form.time) && isGreaterThan(parseFloat(form.time), 10);
  const checkDate =
    isNumeric(form.date) && isRecentDate(parseFloat(form.date), 5);
  let error;
  if (!checkId) {
    error = new Error("Invalid id");
    console.log("Invalid id");
  }
  if (!checkUsername) {
    error = new Error("Invalid username");
    console.log(error);
  }
  if (!checkTime) {
    error = new Error("Invalid time");
    console.log(error);
  }
  if (!checkDate) {
    error = new Error("Invalid date");
    console.log(error);
  }

  return checkId && checkUsername && checkTime && checkDate;
};

module.exports = { validateForm };
