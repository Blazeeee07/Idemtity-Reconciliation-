const logger = require("../config/logger");
const config = require("../config/config");

const cookiePropertiesforProduction = {
  secure: true,
  httpOnly: true,
  domain: ".myleadingcampus.com",
};

function setTokenInCookies(response, accessToken, refreshToken) {
  logger.info("***** set token in cookie *****");
  // clear otp cookie
  response.clearCookie("otpToken");
  response.cookie("accessToken", accessToken, {
    maxAge: config.jwt.accessExpirationMinutes * 60 * 60 * 1000 - 100,
    sameSite: "none",
    ...(process.env.NODE_ENV !== "development" &&
      cookiePropertiesforProduction),
  });
  response.cookie("refreshToken", refreshToken, {
    maxAge: config.jwt.refreshExpirationDays * 1440 * 60 * 60 * 1000 - 100,
    ...(process.env.NODE_ENV !== "development" &&
      cookiePropertiesforProduction),
    sameSite: "none",
    path: "/v1/auth",
  });
}

function setOtpTokenInCookies(response, otpToken) {
  logger.info("***** set token in cookie *****");
  response.cookie("otpToken", otpToken, {
    maxAge: config.jwt.otpTokenExpirationMinutes * 60 * 60 * 1000 - 100,
    sameSite: "none",
    ...(process.env.NODE_ENV !== "development" &&
      cookiePropertiesforProduction),
  });
}

const cookieExtractor = function (request) {
  logger.info("***** extract jwt from cookie *****");
  let token;
  if (request?.cookies) token = request.cookies.accessToken;
  return token;
};

module.exports = {
  setTokenInCookies,
  cookieExtractor,
  setOtpTokenInCookies,
};
