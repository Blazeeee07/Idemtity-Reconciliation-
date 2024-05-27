const crypto = require("node:crypto");
const { Sequelize } = require("sequelize");
const logger = require("../config/logger");
const { Tracker } = require("../models");
const { decrypt } = require("../utils/encrypt");

const { Op } = Sequelize;
const requestTracker = async (request, response, next) => {
  // try {
  //   logger.info("***** request tracker *****");

  //   const data = {
  //     method: request.method,
  //     url: request.originalUrl,
  //     userId: request.user ? decrypt(request.user?.id) : undefined,
  //     schoolId: undefined,
  //     // studentId: undefined,
  //   };

  //   logger.info(JSON.stringify(data));
  //   const trackerId = crypto.randomUUID({ disableEntropyCache: true });
  //   response.trackerId = trackerId;
  //   data.trackerId = trackerId;

  //   switch (request.method) {
  //     case "GET": {
  //       if (Object.keys(request.query).length > 0) {
  //         //
  //       }
  //       break;
  //     }
  //     case "POST": {
  //       data.requestData = JSON.stringify(request.body);
  //       break;
  //     }
  //     case "PATCH": {
  //       data.requestData = JSON.stringify(request.body);
  //       break;
  //     }
  //     case "DELETE": {
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  //   try {
  //     Tracker.create(data);
  //   } catch (error) {
  //     logger.error("Unable to create logs:", error);
  //   }
  //   next();
  // } catch (error) {
  //   logger.error(error);
  //   next(error);
  // }
  next();
};

const responseTracker = (_request, response, next) => {
  // try {
  //   logger.info("***** response tracker *****");
  //   const oldSend = response.send;
  //   response.send = async function (responseData) {
  //     const { trackerId, statusCode } = response;
  //     try {
  //       Tracker.update(
  //         {
  //           responseData: JSON.stringify(responseData),
  //           statusCode,
  //         },
  //         {
  //           where: {
  //             trackerId,
  //             // neglect response of GET requests
  //             method: { [Op.ne]: "GET" },
  //           },
  //         }
  //       );
  //     } catch (error) {
  //       logger.error("Unable to update logs:", error);
  //     }

  //     response.send = oldSend; // set function back to avoid the 'double-send'
  //     return response.send(responseData); // just call as normal with data
  //   };
  //   next();
  // } catch (error) {
  //   next(error);
  // }
  next();
};

module.exports = {
  requestTracker,
  responseTracker,
};
