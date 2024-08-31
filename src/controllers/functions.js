const { v4: uuidv4, validate: validateUUID } = require("uuid");

const validateForm = (form) => {
  const isUUID = (id) => validateUUID(id);
  const isLength = (username) => username.length >= 4 && username.length <= 10;
  const isNumeric = (value) => !isNaN(value);
  const isGreaterThan = (value, min) => value > min;
  const isRecentDate = (date, minutes) =>
    date >= Date.now() - minutes * 60 * 1000;

  const checkId = isUUID(form.id);
  const checkUsername = isLength(form.username);
  const checkTime =
    isNumeric(form.time) && isGreaterThan(parseFloat(form.time), 10);
  const checkDate =
    isNumeric(form.date) && isRecentDate(parseFloat(form.date), 5);

  return checkId && checkUsername && checkTime && checkDate;
};

module.exports = { validateForm };
