const express = require("express");
const {
  register,
  login,
  getAdmin,
  updateAdmin,
  updatePassword,
} = require("../controllers/adminController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

const adminRouter = express.Router();

adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.get("/", getAdmin);
adminRouter.put(
  "/update",
  isAuthenticated,
  upload.fields([
    { name: "homepage", maxCount: 1 },
    { name: "aboutpage", maxCount: 1 },
  ]),
  updateAdmin
);
adminRouter.put("/password", isAuthenticated, updatePassword);

module.exports = adminRouter;
