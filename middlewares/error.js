const httpStatus = require("http-status");
const database = require("../models");
const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

const errorConverter = (error_, _request, _response, next) => {
  let error = error_;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof database.Sequelize.BaseError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, error_.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, _request, response, _next) => {
  let { statusCode, message } = error;
  if (config.env === "production" && !error.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  response.locals.errorMessage = error.message;

  const data = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: error.stack }),
  };

  if (config.env === "development") {
    logger.error(error);
  }

  response.status(statusCode).send(data);
};

module.exports = {
  errorConverter,
  errorHandler,
};
