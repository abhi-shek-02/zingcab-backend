
const express = require('express');
const { validate } = require('../middlewares/validation.middleware');
const { contactUsSchema } = require('../middlewares/validation.middleware');
const contactController = require('../controllers/contact.controller');

const router = express.Router();

// Submit contact form
router.post(
  '/', 
  validate(contactUsSchema),
  contactController.submitContactForm
);

module.exports = router;
