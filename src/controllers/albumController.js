const sendResponse = require("../utils/sendResponse");
const Album = require("../models/albumModel");
const cloudinary = require("../configs/cloudinaryConfig");
const streamifier = require("streamifier");

exports.createAlbum = async (req, res) => {
  try {
    const { title, desc, year, location, shotOn } = req.body;
    const coverImage = req.file;

    if (!title || !desc) {
      return sendResponse(res, 400, "Title and description are required.");
    }

    if (!coverImage) {
      return sendResponse(res, 400, "Cover image is required.");
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "frames-by-ashwin/albums",
            use_filename: true,
            eager: [{ width: 500, quality: "auto", fetch_format: "auto" }],
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(coverImage.buffer);

    if (!result) {
      return sendResponse(res, 400, "Cover image upload failed.");
    }

    const album = await Album.create({
      title,
      desc,
      year,
      location,
      shotOn,
      coverImage: result.eager[0].secure_url,
      coverPublicId: result.public_id,
    });

    sendResponse(res, 201, "Album created successfully.", { album });
  } catch (error) {
    console.error("Error creating album:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    if (!albums) {
      return sendResponse(res, 404, "No albums found.");
    }

    sendResponse(res, 200, "Albums fetched successfully.", { albums });
  } catch (error) {
    console.error("Error fetching albums:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { title, desc } = req.body;
    if (!title || !desc)
      return sendResponse(res, 400, "Title and description are required.");

    const updated = {};
    if (title) updated.title = title;
    if (desc) updated.desc = desc;

    const album = await Album.findByIdAndUpdate(
      albumId,
      { $set: updated },
      { new: true, runValidators: true }
    );

    if (!album) return sendResponse(res, 404, "Album not found.");

    sendResponse(res, 200, "Album updated successfully.");
  } catch (error) {
    console.error("Error updating album:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId);
    if (!album) return sendResponse(res, 404, "Album not found.");

    await cloudinary.uploader.destroy(album.coverPublicId);

    await Album.findByIdAndDelete(albumId);

    sendResponse(res, 200, "Album deleted successfully.");
  } catch (error) {
    console.error("Error deleting album:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId);
    if (!album) return sendResponse(res, 404, "Album not found.");

    sendResponse(res, 200, "Album details fetched successfully.", { album });
  } catch (error) {
    console.error("Error fetching album details:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};
