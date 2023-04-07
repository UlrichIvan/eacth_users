// const { default: isEmail } = require("validator");
const { isEmail } = require("validator");
const Role = require("../models/roles");

const { ObjectId } = require("mongoose").Types;
const Validators = {
  firstName: (value) => /^[a-zA-Z]{1,50}$/.test(value),
  lastName: (value) => /^[a-zA-Z]{1,50}$/.test(value),
  email: (value) => isEmail(value),
  restaurant: (value) => ObjectId.isValid(value),
  role: (value) =>
    [Role.SUPER_ADMIN, Role.RH, Role.COMPTABLE, Role.MANAGER].includes(value),
  isOnline: (value) => typeof value === "boolean",
  _creator: (value) => ObjectId.isValid(value),
};
module.exports = { Validators };
