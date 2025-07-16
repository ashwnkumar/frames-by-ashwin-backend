const mongoose = require("mongoose");
const { envConfig } = require("./envConfig")

const connectDb = async () => {
    try {
        await mongoose.connect(`${envConfig.MONGO_URI}/frames-by-ashwn-backend`, {});
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

module.exports = connectDb

