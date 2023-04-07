const express = require("express");
const {
  createUser,
  deleteUser,
  UpdateUser,
  fetchUsers,
} = require("../controllers/userControllers");
const auth = require("../controllers/auth/authentification");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");

var userRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//************CREATE ROUTE********************
userRouter.post("/create", authmiddleware, upload.single("file"), createUser);
//**************************************** *//

//************LOGIN ROUTE********************
userRouter.post("/login", auth.login);
//**************************************** *//

//************DELETE ROUTE********************
userRouter.delete("/delete/:id", authmiddleware, deleteUser);
//**************************************** *//

//************UPDATE ROUTE********************
userRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  UpdateUser
);
//**************************************** *//

//************GET ROUTE********************
userRouter.get("/fetch", authmiddleware, fetchUsers);
//**************************************** *//

//Export route to be used on another place
module.exports = userRouter;
