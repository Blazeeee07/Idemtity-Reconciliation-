const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  keyGenerator: (request) => {
    return request.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
});

module.exports = {
  authLimiter,
};
