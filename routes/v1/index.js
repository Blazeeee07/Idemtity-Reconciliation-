const express = require("express");
const config = require("../../config/config");
const {
  defaultRoutes,
  developmentRoutes,
} = require("../../config/router-config");

const router = express.Router();

for (const route of defaultRoutes) {
  router.use(route.path, route.route);
}

/* istanbul ignore next */
if (config.env === "development") {
  for (const route of developmentRoutes) {
    router.use(route.path, route.route);
  }
}

module.exports = router;
