const { default: mongoose } = require("mongoose");

const photoModel = new mongoose.Schema({
 
  imageUrl: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  previewUrl: {
    type: String,
  },
  publicId: {
    type: String,
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Photo", photoModel);
