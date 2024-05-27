const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const logger = require("./logger");

const config = require("./config");
const { tokenTypes } = require("./tokens");
const { User, Student } = require("../models");
const { decrypt } = require("../utils/encrypt");
const { cookieExtractor } = require("../utils/cookie");
const { LOGINTYPES } = require("./constant");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest:
    config.strategy === "token"
      ? ExtractJwt.fromAuthHeaderAsBearerToken()
      : cookieExtractor,
};

const jwtVerify = async (payload, done) => {
  logger.info("***** verify jwt token *****");
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }

    if (payload.loginType == LOGINTYPES.USER) {
      const user = await User.findByPk(decrypt(payload.sub));
      if (!user) {
        return done(undefined, false);
      }
      return done(undefined, { type: LOGINTYPES.USER, user: user });
    } else if (payload.loginType == LOGINTYPES.STUDENT) {
      const student = await Student.findByPk(decrypt(payload.sub));
      if (!student) {
        return done(undefined, false);
      }
      if (student) {
        return done(undefined, { role: 4, ...student });
      }
      // return done(undefined, { type: LOGINTYPES.STUDENT, user: student });
    }
    return done(undefined, false);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
