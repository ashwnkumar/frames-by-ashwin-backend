const sendResponse = (res, statusCode, message, data = null) => {
  const success = statusCode >= 200 && statusCode < 300;

  const response = {
    success,
    statusCode,
    message,
    ...(data !== null && { data }),
  };
  return res.status(statusCode).json(response);
};

module.exports = sendResponse;