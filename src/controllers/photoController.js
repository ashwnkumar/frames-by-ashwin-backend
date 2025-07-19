const Photo = require("../models/photoModel");
const Album = require("../models/albumModel");
const sendResponse = require("../utils/sendResponse");
const cloudinary = require("../configs/cloudinaryConfig");
const streamifier = require("streamifier");

exports.addPhoto = async (req, res) => {
  try {
    const { albumId, isFeatured } = req.body;
    const image = req.file;

    if (!image) {
      return sendResponse(res, 400, "Image file is required");
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "frames-by-ashwin/photos",
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

    const result = await streamUpload(image.buffer);

    const uploadedImage = {
      fullUrl: result.secure_url,
      previewUrl: result.eager[0].secure_url,
      publicId: result.public_id,
    };

    const newImage = await Photo.create({
      imageUrl: uploadedImage.fullUrl,
      previewUrl: uploadedImage.previewUrl,
      publicId: uploadedImage.publicId,
      albumId,
      isFeatured: isFeatured,
    });

    sendResponse(res, 201, "Photo added successfully", { photo: newImage });
  } catch (error) {
    console.error("Error adding photo:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const result = await Photo.find({ albumId: null }).sort({ createdAt: -1 });
    if (!result) {
      return sendResponse(res, 404, "No photos found.");
    }

    sendResponse(res, 200, "Photos fetched successfully", { photos: result });
  } catch (error) {
    console.error("Error fetching photos:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.getPhotosByAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);
    if (!album) {
      return sendResponse(res, 404, "Album not found.");
    }

    const photos = await Photo.find({ albumId }).sort({ createdAt: -1 });

    sendResponse(res, 200, "Photos fetched successfully", { photos });
  } catch (error) {
    console.error("Error fetching photos by album:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.getFeaturedPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ isFeatured: true }).sort({
      createdAt: -1,
    });
    if (!photos || photos.length === 0) {
      return sendResponse(res, 404, "No featured photos found.");
    }

    sendResponse(res, 200, "Featured photos fetched successfully", { photos });
  } catch (error) {
    console.error("Error fetching featured photos:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return sendResponse(res, 404, "Photo not found.");
    }
    await cloudinary.uploader.destroy(photo.publicId);
    await Photo.findByIdAndDelete(photoId);

    sendResponse(res, 200, "Photo deleted successfully");
  } catch (error) {
    console.error("Error deleting photo:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};
