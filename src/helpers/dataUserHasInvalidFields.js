// valid user data before save in database

const { isEmail } = require("validator");
const Role = require("../models/roles");
const { ObjectId } = require("mongoose").Types;
const dataUserHasInvalidFields = (body) => {
  if (!body) return null;
  else {
    const stringFormat = /^[a-zA-Z]{1,50}$/;
    console.log({
      firstName: !stringFormat.test(body?.firstName),
      lastName: !stringFormat.test(body?.lastName),
      email: !isEmail(body?.email),
      role: ![Role.SUPER_ADMIN, Role.RH, Role.COMPTABLE, Role.MANAGER].includes(
        body.role
      ),
      password: !body?.password,
      _creator: !ObjectId.isValid(body?._creator),
      restaurant: !ObjectId.isValid(body?.restaurant),
    });
    if (
      !stringFormat.test(body?.firstName) ||
      !stringFormat.test(body?.lastName)
    ) {
      return true;
    }

    if (!isEmail(body?.email)) {
      return true;
    }

    if (
      ![Role.SUPER_ADMIN, Role.RH, Role.COMPTABLE, Role.MANAGER].includes(
        body.role
      )
    ) {
      return true;
    }
    if (
      !body?.password ||
      !ObjectId.isValid(body?._creator) ||
      !ObjectId.isValid(body?.restaurant)
    ) {
      return true;
    }
    return false;
  }
};

module.exports = {
  dataUserHasInvalidFields,
};
