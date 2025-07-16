const jwt = require("jsonwebtoken");
const { envConfig } = require("../configs/envConfig");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    envConfig.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
};

module.exports = generateToken;
