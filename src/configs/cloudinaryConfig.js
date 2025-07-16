const { envConfig } = require("./envConfig")

const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
    api_key: envConfig.CLOUDINARY_API_KEY,
    api_secret: envConfig.CLOUDINARY_API_SECRET
})

module.exports = cloudinary

