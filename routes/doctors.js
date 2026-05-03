const express = require('express');
const { getDoctors, getRecommendedDoctors } = require('../controllers/doctors');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/recommend', protect, getRecommendedDoctors);

module.exports = router;
