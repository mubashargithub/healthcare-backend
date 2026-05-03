const Doctor = require('../models/Doctor');
const diseaseData = require('../config/diseaseData');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Doctor.find(JSON.parse(queryStr));

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Doctor.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const doctors = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: doctors.length,
            pagination,
            data: doctors
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get recommended doctors based on disease and city
// @route   GET /api/doctors/recommend
// @access  Private
exports.getRecommendedDoctors = async (req, res, next) => {
    try {
        const { disease, city } = req.query;

        if (!disease) {
            return res.status(400).json({ success: false, error: 'Please provide a disease for recommendation' });
        }

        // Map disease to specialization using the new comprehensive mapping
        const details = diseaseData[disease] ||
            diseaseData[Object.keys(diseaseData).find(key => key.toLowerCase() === disease.toLowerCase())] ||
            diseaseData["Default"];

        const targetSpec = details.specialization;

        // Search for doctors with specialization (Pakistan-wide)
        let queryObj = { specialization: { $regex: targetSpec, $options: 'i' } };

        let doctors = await Doctor.find(queryObj).sort('-rating');
        
        // Ensure distinct doctors by name and city
        const uniqueDoctors = [];
        const seen = new Set();
        doctors.forEach(doc => {
            const key = `${doc.name}-${doc.city}`.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                uniqueDoctors.push(doc);
            }
        });
        doctors = uniqueDoctors;

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
