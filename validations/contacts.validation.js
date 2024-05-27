const Joi = require("joi");
const { decryptAndValidate } = require("./custom.validation");

const identify = {
    body: Joi.object({
      email: Joi.string().email(),
      phone: Joi.string(),
      linkedId: decryptAndValidate("Invalid linkedId", false),

    }),
  };
  

  module.exports = {
    identify,
  };
  