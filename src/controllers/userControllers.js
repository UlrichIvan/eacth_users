const cryptoJS = require("crypto-js");

const userService = require("../services/userServices");
const {
  dataUserHasInvalidFields,
} = require("../helpers/dataUserHasInvalidFields");
const {
  dataUpdateUserHasInvalidFields,
} = require("../helpers/checkFormatFields");
const Role = require("../models/roles");
const { ObjectId } = require("mongoose").Types;

//Create user in Data Base
const createUser = async (req, res) => {
  try {
    // match errors inside of body request
    if (dataUserHasInvalidFields(req.body)) {
      return res.status(500).json({ message: "invalid data!!!" });
    } else {
      let user = await userService.findUser({ email: req.body.email });
      // check if user already exits
      if (user) {
        return res.status(500).json({ message: "User already exists!!!" });
      } else {
        // fetch user creator inside of database
        let creator = await userService.findUser({ _id: req.body._creator });
        if (!creator) {
          return res.status(500).json({ message: "invalid data!!!" });
        } else {
          let newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            restaurant: req.body.restaurant,
            username: [req.body.firstName, req.body.lastName].join(" "),
            role: req.body.role,
            password: cryptoJS.AES.encrypt(
              req.body.password,
              process.env.PASS_SEC
            ).toString(),
            avatar: req?.file
              ? "/datas/" + req.file.filename
              : "/datas/avatar.png",
            _creator: creator,
          };
          console.log("####################");
          console.log({ newUser, creator });
          // save new user in database
          await userService.createUser(newUser);
          res.status(200).json({ message: "User created successfully!!!" });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error encounterd creating user!!!" });
  }
};

//Delete user in database
const deleteUser = async (req, res) => {
  try {
    if (!req.params?.id || !req.body?._creator) {
      return res.status(401).json({ message: "invalid params send!!" });
    }

    if (
      ObjectId.isValid(req.params?.id) &&
      ObjectId.isValid(req.body?._creator)
    ) {
      let creator = await userService.findUser({
        _id: req.body._creator,
      });

      if (!creator) res.status(401).json({ message: "invalid params!!" });
      else {
        // find user and update "deleteAt" field if user exists and never deleted(deletedAt: null)
        if ([Role.SUPER_ADMIN, Role.MANAGER].includes(creator.role)) {
          let user = await userService.deleteUser(
            { _id: req.params.id, deletedAt: null },
            { _creator: creator } // the current user who do this action
          ); // if user exists in database user must be not null otherwise user must be null

          console.log({ userDeleted: user });

          if (!user)
            return res
              .status(401)
              .json({ message: "User not exists or already delete!!" });
          else {
            if (user.deletedAt) {
              res.status(200).json({ message: "User delete successfully!!" });
            } else {
              res.status(401).json({ message: "User delete failed!!" });
            }
          }
        } else {
          return res.status(401).json({ message: "unable to delete user!!" });
        }
      }
    } else {
      res.status(401).json({ message: "invalid params send!!" });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Error occured during delete request!!" });
  }
};

// Update user in database

const UpdateUser = async (req, res) => {
  try {
    let data = dataUpdateUserHasInvalidFields(req.body);
    // check if body request is valid
    console.log({
      ...data,
      id: ObjectId.isValid(req.params?.id),
    });
    if (!data.error && ObjectId.isValid(req.params?.id)) {
      let creator = await userService.findUser({
        _id: req.body._creator,
      });
      if (!creator) res.status(401).json({ message: "invalid data!!" });
      else {
        console.log({ creatorRole: creator.role });
        data["_creator"] = creator; // set user that make update in database
        if ([Role.SUPER_ADMIN, Role.MANAGER].includes(creator.role)) {
          let user = await userService.UpdateUser(
            { _id: req.params.id },
            {
              avatar: req?.file
                ? "/datas/" + req.file.filename
                : "/datas/avatar.png",
              ...data.body,
            }
          );
          if (user) {
            res.status(200).json({ message: "User update successfully!!" });
          } else if (!user) {
            res.status(401).json({
              message: "User update failed: user not exits in database!!",
            });
          }
        } else {
          return res.status(401).json({ message: "unable to update user!!" });
        }
      }
    } else {
      return res.status(401).json({ message: "invalid data send!!" });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Error occured during delete request!!" });
  }
};

// fetch users

const fetchUsers = async (req, res) => {
  try {
    console.log({
      restaurant: ObjectId.isValid(req.query?.restaurant),
      _creator: ObjectId.isValid(req.query?._creator),
    });
    if (
      ObjectId.isValid(req.query?.restaurant) &&
      ObjectId.isValid(req.query?._creator)
    ) {
      let creator = await userService.findUser({ _id: req.query?._creator });

      if (!creator) {
        res.status(401).json({ message: "invalid data" });
      } else {
        if ([Role.SUPER_ADMIN, Role.MANAGER, Role.RH].includes(creator.role)) {
          if (Role.SUPER_ADMIN === creator.role) {
            let users = await userService.findUsers({
              restaurant: req.query?.restaurant,
            });
            return res.status(200).json({ users });
          }

          if (Role.MANAGER === creator.role) {
            let users = await userService.findUsers({
              restaurant: req.query?.restaurant,
              role: { $ne: Role.SUPER_ADMIN },
            });
            return res.status(200).json({ users });
          }

          if (Role.RH === creator.role) {
            let users = await userService.findUsers({
              restaurant: req.query?.restaurant,
              role: Role.COMPTABLE,
            });
            return res.status(200).json({ users });
          }
        } else {
          res.status(401).json({ message: "unable to get users data" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured during fetch action" });
  }
};
//EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
  createUser,
  deleteUser,
  UpdateUser,
  fetchUsers,
};
