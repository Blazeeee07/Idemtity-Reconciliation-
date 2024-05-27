const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const cookieParser = require("cookie-parser");
const requestIp = require("request-ip");
const responseTime = require("response-time");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
require("./cron");
const { sequelize } = require("./models");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// get ip //
app.use(requestIp.mw());

// response time in response header
app.use(responseTime());

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({limit: '50mb' }));
// app.use(express.urlencoded({limit: '50mb'}));

// parse json request body
app.use(cookieParser());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

const allowlist = new Set(config.allowList.split(","));
const corsOptionsDelegate = function (request, callback) {
  let corsOptions;
  // eslint-disable-next-line unicorn/prefer-ternary
  if (allowlist.has(request.header("Origin"))) {
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(undefined, corsOptions); // callback expects two parameters: error and options
};

// enable cors
app.use(cors(corsOptionsDelegate));
// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// health app server
app.get("/elb-status", (_request, response) => {
  return response.status(200).send("I am healthy");
});

app.get("/db-status", async (_request, response, next) => {
  try {
    await sequelize.authenticate();
    return response.status(200).send("db is healthy");
  } catch (error) {
    next(error);
  }
});

// v1 api routes
app.use("/api", routes);

// send back a 404 error for any unknown api request
app.use((request, _response, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
