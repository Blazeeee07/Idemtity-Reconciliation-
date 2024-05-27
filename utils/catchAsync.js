const logger = require("../config/logger");

const catchAsync = (function_) => (request, response, next) => {
  Promise.resolve(function_(request, response, next)).catch((error) => {
    logger.info(JSON.stringify(error, undefined, 2));
    next(error);
  });
};

module.exports = catchAsync;
