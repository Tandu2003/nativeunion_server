const sendErrorResponse = (res, statusCode, message, errorDetails) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails || null,
  });
};

const sendSuccessResponse = (res, data, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

module.exports = { sendErrorResponse, sendSuccessResponse };
