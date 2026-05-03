const express = require('express');
const { submitContactMessage } = require('../controllers/contactController');

const router = express.Router();

// Allow public access to submit queries
router.post('/', submitContactMessage);

module.exports = router;
