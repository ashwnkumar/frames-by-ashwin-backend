const sendResponse = require("../utils/sendResponse");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const cloudinary = require("../configs/cloudinaryConfig");

exports.register = async (req, res) => {
  try {
    const existing = await Admin.findOne();
    if (existing) return sendResponse(res, 400, "Admin already exists.");

    const { name, email, password, about, links } = req.body;

    if (!name || !email || !password)
      return sendResponse(res, 400, "Name, email and password are required.");

    const admin = await Admin.create({ name, email, password, about, links });

    sendResponse(res, 201, "Admin registered successfully.", admin);
  } catch (error) {
    console.error("Error registering admin:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return sendResponse(res, 400, "Password is required.");

    const admin = await Admin.findOne().select("+password");
    if (!admin) return sendResponse(res, 404, "Admin not found.");

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return sendResponse(res, 401, "Invalid credentials.");

    const token = generateToken(admin);

    sendResponse(res, 200, "Admin logged in successfully.", { token });
  } catch (error) {
    console.error("Error logging in admin:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return sendResponse(res, 404, "Admin not found.");

    sendResponse(res, 200, "Admin details fetched successfully.", { admin });
  } catch (error) {
    console.error("Error getting admin:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, about, links, location } = req.body;

    const admin = await Admin.findById(req.user._id);
    if (!admin) return sendResponse(res, 404, "Admin not found.");

    const updated = {};
    if (name) updated.name = name.trim();
    if (email) updated.email = email.trim();
    if (about) updated.about = about.trim();
    if (links) updated.links = links;
    if (location) updated.location = location.trim();

    if (req.files?.homepage?.[0]?.buffer) {
      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image",folder: "frames-by-ashwin/admin"}, (error, result) => {
            if (error) return reject(error);
            updated.homePageUrl = result.secure_url;
            updated.homePagePublicId = result.public_id;
            resolve();
          })
          .end(req.files.homepage[0].buffer);
      });
    }

    if (req.files?.aboutpage?.[0]?.buffer) {
      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image", folder: "frames-by-ashwin/admin" }, (error, result) => {
            if (error) return reject(error);
            updated.aboutPageUrl = result.secure_url;
            updated.aboutPagePublicId = result.public_id;
            resolve();
          })
          .end(req.files.aboutpage[0].buffer);
      });
    }

    await Admin.findByIdAndUpdate(
      req.user._id,
      { $set: updated },
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, "Admin updated successfully.");
  } catch (error) {
    console.error("Error updating admin:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return sendResponse(res, 400, "Please provide all required fields.");

    const admin = await Admin.findById(req.user._id).select("+password");
    if (!admin) return sendResponse(res, 404, "Admin not found.");

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return sendResponse(res, 400, "Current password is incorrect.");

    admin.password = newPassword;
    await admin.save();

    sendResponse(res, 200, "Password updated successfully.");
  } catch (error) {
    console.error("Error updating password:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};
