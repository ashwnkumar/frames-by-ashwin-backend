const jwt = require("jsonwebtoken");
const { envConfig } = require("../configs/envConfig");
const Admin = require("../models/adminModel");
const sendResponse = require("../utils/sendResponse");

const isAuthenticated = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return sendResponse(res, 401, "No access token found.");

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return sendResponse(res, 401, "Invalid or missing token.");

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET_KEY);
    const admin = await Admin.findById(decoded.id);

    if (!admin) return sendResponse(res, 401, "Invalid or missing token.");

    req.user = admin;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    sendResponse(res, 401, "Invalid or Expired Token");
  }
};

module.exports = { isAuthenticated };
