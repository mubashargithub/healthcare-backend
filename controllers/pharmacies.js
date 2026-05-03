const Pharmacy = require('../models/Pharmacy');
const axios = require('axios');

// @desc    Get all pharmacies or filter by city
// @route   GET /api/pharmacies
// @access  Public
exports.getPharmacies = async (req, res, next) => {
    try {
        const { city } = req.query;
        let query = {};

        if (city) {
            query.city = city;
        }

        const pharmacies = await Pharmacy.find(query);

        res.status(200).json({
            success: true,
            count: pharmacies.length,
            data: pharmacies
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get pharmacies from Overpass API (Backend Proxy to bypass CORS)
// @route   GET /api/pharmacies/nearby
// @access  Public
exports.getNearbyOverpass = async (req, res, next) => {
    try {
        const { lat, lon, radius = 15000, name, city } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ success: false, error: 'Latitude and Longitude are required' });
        }

        let overpassQuery = `[out:json][timeout:25];`;
        
        if (city) {
            // Search by city boundaries with fallback to healthcare=pharmacy
            overpassQuery += `area[name="${city}"]->.a;
            (
                nwr(area.a)["amenity"~"pharmacy|chemist"];
                nwr(area.a)["healthcare"="pharmacy"];
            )`;
        } else if (lat && lon) {
            // Radial search with broadened tags
            overpassQuery += `(
                nwr(around:${radius},${lat},${lon})["amenity"~"pharmacy|chemist"];
                nwr(around:${radius},${lat},${lon})["healthcare"="pharmacy"];
            )`;
        } else {
            return res.status(400).json({ success: false, error: 'Latitude and Longitude or City name are required' });
        }

        if (name) {
            // Add case-insensitive name filter
            overpassQuery += `["name"~"${name}",i]`;
        }
        
        overpassQuery += `;out center 200;`;
        
        const mirrors = [
            'https://overpass-api.de/api/interpreter',
            'https://lz4.overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter'
        ];

        let overpassData = null;
        let lastError = null;

        for (const mirror of mirrors) {
            try {
                const response = await axios.get(mirror, {
                    params: { data: overpassQuery },
                    headers: { 'User-Agent': 'DiagnoAI-Health-Project/1.0 (contact: admin@diagnoai.com)' },
                    timeout: 10000
                });
                
                if (response.data && response.data.elements) {
                    overpassData = response.data;
                    break;
                }
            } catch (err) {
                console.error(`Mirror ${mirror} failed:`, err.message);
                lastError = err;
            }
        }

        if (!overpassData) {
            throw lastError || new Error('All map mirrors are unresponsive');
        }

        res.status(200).json({
            success: true,
            data: overpassData
        });
    } catch (err) {
        console.error('Overpass Proxy Error:', err.message);
        res.status(500).json({ success: false, error: 'Map data service is currently overloaded. Please try again.' });
    }
};

// @desc    Get coordinates from address (Backend Proxy for Nominatim)
// @route   GET /api/pharmacies/geocode
// @access  Public
exports.geocodeAddress = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ success: false, error: 'Query is required' });

        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        const response = await axios.get(nominatimUrl, {
            headers: { 'User-Agent': 'DiagnoAI/1.0' }
        });

        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Geocoding failed' });
    }
};
