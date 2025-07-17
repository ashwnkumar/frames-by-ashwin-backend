require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/configs/db");
const { envConfig } = require("./src/configs/envConfig");
const adminRouter = require("./src/routes/adminRouter");
const photoRouter = require("./src/routes/photoRouter");
const albumRouter = require("./src/routes/albumRouter");

const app = express();

connectDB();

app.use(
  cors({
    origin: envConfig.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/admin", adminRouter);
app.use("/api/photos", photoRouter);
app.use("/api/albums", albumRouter);

const PORT = envConfig.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://192.168.1.40:${PORT}`);
});
