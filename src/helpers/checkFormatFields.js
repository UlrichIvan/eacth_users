// valid user data before save in database

const { UpdateFields } = require("../configs/configModules");
const { Validators } = require("./fieldValidator");

const dataUpdateUserHasInvalidFields = (body) => {
  if (!body) return null;
  else {
    for (let key in body) {
      if (!UpdateFields.includes(key)) delete body[key]; //delete additional fields not utlis to valid format key format
    }
    let keys = Object.keys(body); // get keys from body object
    //verify if each field is valided before save in database
    let keysErrors = keys.filter((key) => {
      return !UpdateFields.includes(key);
    });

    // if keys body have errors
    if (keysErrors.length) return { error: true };
    console.log("###############################");
    // verify if each value field is valided before save in database
    let valuesErrors = keys.filter((key) => {
      console.log({
        key,
        value: body[key],
        valided: Validators[key](body[key]),
      });
      return !Validators[key](body[key]);
    });
    console.log("###############################");
    // console.log({ keysErrors, valuesErrors });

    // if values body have errors
    if (valuesErrors.length) return { error: true };

    // keys and value body are valid

    return { error: false, body };
  }
};

module.exports = {
  dataUpdateUserHasInvalidFields,
};
