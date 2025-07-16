const express = require("express");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
  createAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  getAlbumById,
} = require("../controllers/albumController");
const upload = require("../middlewares/multer");

const albumRouter = express.Router();

albumRouter.post("/", isAuthenticated, upload.single("coverImage"), createAlbum);
albumRouter.get("/", getAlbums);
albumRouter.get("/:albumId", getAlbumById);
albumRouter.put("/:albumId", updateAlbum);
albumRouter.delete("/:albumId", isAuthenticated, deleteAlbum);

module.exports = albumRouter;
