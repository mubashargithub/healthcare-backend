const express = require('express');
const { getPharmacies, getNearbyOverpass, geocodeAddress } = require('../controllers/pharmacies');

const router = express.Router();

router.get('/', getPharmacies);
router.get('/nearby', getNearbyOverpass);
router.get('/geocode', geocodeAddress);

module.exports = router;
