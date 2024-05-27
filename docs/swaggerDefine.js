const { version } = require("../package.json");
const config = require("../config/config");

const swaggerDefine = {
  openapi: "3.0.0",
  info: {
    title: "Backend-app API documentation",
    version,
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDefine;
