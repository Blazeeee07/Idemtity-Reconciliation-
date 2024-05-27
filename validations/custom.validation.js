const Joi = require("joi");
const { decrypt } = require("../utils/encrypt");
const logger = require("../config/logger");

const objectId = (value, helpers) => {
  if (!/^[\dA-Fa-f]{24}$/.test(value)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const validJson = (value, helpers) => {
  if (value) {
    try {
      const value_ = JSON.parse(value);
      return value;
    } catch {
      return helpers.message("section should be a valid json");
    }
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (!/\d/.test(value) || !/[A-Za-z]/.test(value)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

const classTeacherSignValidation = (value, helper) => {
  if (value) {
    try {
      const fileName = decrypt(value);
      const mimetype = fileName.split(".")[1];
      if (!["png", "jpg", "jpeg", "svg", "svg+xml"].includes(mimetype)) {
        return helper.message("Invalid classTeacherSign");
      }
      return fileName;
    } catch (error) {
      logger.error(error);
      return helper.message("Invalid classTeacherSign");
    }
  }
};

const decryptAndValidate = (message, isRequired = true) => {
  if (!isRequired) {
    return Joi.string()
      .trim()
      .custom((value, helper) => {
        if (value) {
          try {
            return +decrypt(value);
          } catch (error) {
            logger.error(error);
            return helper.message(message);
          }
        }
      });
  }
  return Joi.string()
    .required()
    .trim()
    .custom((value, helper) => {
      if (value) {
        try {
          return +decrypt(value);
        } catch (error) {
          logger.error(error);
          return helper.message(message);
        }
      }
    });
};

module.exports = {
  objectId,
  password,
  decryptAndValidate,
  classTeacherSignValidation,
  validJson,
};
