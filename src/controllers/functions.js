const { check } = require("express-validator");
const validateForm = (form) => {
  let checkId = form.id.isUUID();
  let checkUsername = form.username.isLength({ min: 4, max: 10 });
  let checkTime = form.time.isNumeric() && form.time > 10;
  let checkDate =
    form.date.isNumeric() && form.date >= Date.now() - 5 * 60 * 1000;
  return checkId && checkUsername && checkTime && checkDate;
};

module.exports = { validateForm };
