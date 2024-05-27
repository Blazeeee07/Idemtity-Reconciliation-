const { requestTracker, responseTracker } = require("../middlewares/tracker");
const auth = require("../middlewares/auth");

const manageTracker = (router, requiredRights) => {
  router.use(auth(requiredRights));
  router.use(requestTracker);
  router.use(responseTracker);
};

module.exports = {
  manageTracker,
};
