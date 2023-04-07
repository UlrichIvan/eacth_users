const mongoose = require("mongoose");
const Role = require("../models/roles");
const validator = require("validator");
const Schema = mongoose.Schema;

const UserSchemaObject = {
  firstName: {
    type: String,
    maxlength: 50,
  },
  lastName: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: function () {
      return validator.isEmail(this.email);
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: Role.SUPER_ADMIN,
    enum: [Role.SUPER_ADMIN, Role.RH, Role.COMPTABLE, Role.MANAGER],
  },
  avatar: {
    type: String,
    default: "/data/uploads/mcf.png",
  },
  restaurant: {
    type: mongoose.Types.ObjectId,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  _creator: {
    type: Schema.ObjectId,
    ref: "User",
  },

  deletedAt: { type: Date, default: null },
};
const UserSchema = new Schema(UserSchemaObject, {
  timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);
