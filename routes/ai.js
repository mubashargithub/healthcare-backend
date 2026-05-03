const express = require('express');
const { predictDisease, getPredictionHistory, getSymptoms, savePrediction } = require('../controllers/ai');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/symptoms', getSymptoms);
router.post('/predict', protect, predictDisease);
router.post('/save', protect, savePrediction);
router.get('/history', protect, getPredictionHistory);

module.exports = router;
