const { default: mongoose } = require("mongoose");

const albumModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    coverImage: {
      type: String,
    },
    coverPublicId: {
      type: String,
    },
    year: {
      type: String,
    },
    location: {
      type: String,
    },
    shotOn: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", albumModel);
