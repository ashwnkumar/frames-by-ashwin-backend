const express = require("express");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");
const {
  addPhoto,
  getPhotos,
  getPhotosByAlbum,
  getFeaturedPhotos,
  deletePhoto,
} = require("../controllers/photoController");

const photoRouter = express.Router();

photoRouter.post("/", isAuthenticated, upload.single("image"), addPhoto);
photoRouter.get("/featured", getFeaturedPhotos);
photoRouter.get("/", getPhotos);
photoRouter.get("/:albumId", getPhotosByAlbum);
photoRouter.put("/:photoId", isAuthenticated, addPhoto);
photoRouter.delete("/:photoId", isAuthenticated, deletePhoto);

module.exports = photoRouter;
