const app = require("./app");
const logger = require("./config/logger");
const { sequelize } = require("./models");
const config = require("./config/config");
const PORT = 8081;

let server;
sequelize
  .sync({ force: false })
  .then(() => {
    logger.info("Connection has been established successfully.");
    server = app.listen(PORT, () => {
      logger.info(`Listening to port ${config.port}`);
    });
    server.timeout = 300000
  })
  .catch((error) => {
    logger.error("Unable to connect to the database:", error);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
