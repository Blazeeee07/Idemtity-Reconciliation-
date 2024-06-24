const express = require("express");
const validate = require("../../middlewares/validate");
const { contactsValidation } = require("../../validations");
const {  contactsController } = require("../../controllers");

const router = express.Router();

router.post(
    "/identify",
    validate(contactsValidation.identify),
    contactsController.identify
);

router.get(
  "/",
    contactsController.get  
)

  module.exports=router;