const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const adminModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    about: {
      type: String,
    },
    links: {
      type: [
        {
          title: String,
          url: String,
        },
      ],
      default: [
        { title: "Instagram", url: "" },
        { title: "Mail", url: "" },
      ],
    },
    homePageUrl: {
      type: String,
    },
    homePagePublicId: {
      type: String,
    },
    aboutPageUrl: {
      type: String,
    },
    aboutPagePublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

adminModel.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Admin", adminModel);
