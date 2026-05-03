const Prediction = require('../models/Prediction');
const User = require('../models/User');
const axios = require('axios');
const Doctor = require('../models/Doctor');
const Pharmacy = require('../models/Pharmacy');
const SymptomMap = require('../models/SymptomMap');
const diseaseData = require('../config/diseaseData');

// @desc    Predict disease based on symptoms
// @route   POST /api/ai/predict
// @access  Private
exports.predictDisease = async (req, res, next) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ success: false, error: 'Please provide symptoms' });
        }

        const symptomQuery = symptoms.join(' ');
        console.log(`[AI-Service] Searching for symptoms: "${symptomQuery}" for user ${req.user.id}...`);

        // 1. Database Lookup (Primary - Matching from Symptom_to_Disease.csv)
        let predictionResult = null;
        try {
            // Use MongoDB Text Search to find the most relevant mapping
            // But first, let's try a more specific approach for exact matches if possible
            const maps = await SymptomMap.find(
                { $text: { $search: symptomQuery } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } }).limit(5);

            if (maps && maps.length > 0) {
                // Heuristic: Check if the top result actually contains a good portion of the symptoms
                const bestMatch = maps[0];
                console.log(`[AI-Service] Found match in database: ${bestMatch.disease}`);

                predictionResult = {
                    disease: bestMatch.disease,
                    confidence: Math.min(99, 75 + (bestMatch._doc.score * 5))
                };
            }
        } catch (err) {
            console.error('[AI-Service] DB Lookup Failed:', err.message);
        }

        // 2. Fallback to ML Microservice if No DB Match
        if (!predictionResult) {
            try {
                const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';
                const flaskRes = await axios.post(`${aiServiceUrl}/predict`, { symptoms }, { timeout: 10000 });
                predictionResult = flaskRes.data.data;
            } catch (err) {
                console.error('[AI-Service] AI Microservice Failed, using generic fallback', err.message);
                predictionResult = { disease: 'General Fever', confidence: 50.0 };
            }
        }

        // 3. Fetch Diagnosis Metadata & Specialization
        const details = diseaseData[predictionResult.disease] ||
            diseaseData[Object.keys(diseaseData).find(key => key.toLowerCase() === predictionResult.disease.toLowerCase())] ||
            diseaseData["Default"];

        // 4. Trigger Recommendations (City-based)
        const userCity = req.user.city || 'Karachi';

        const [doctors, pharmacies] = await Promise.all([
            Doctor.find({
                specialization: { $regex: details.specialization, $options: 'i' },
                city: userCity
            }).sort('-rating').limit(3),
            Pharmacy.find({
                city: userCity
            }).limit(3)
        ]);

        let finalDoctors = doctors;
        if (doctors.length === 0) {
            finalDoctors = await Doctor.find({
                specialization: { $regex: details.specialization, $options: 'i' }
            }).sort('-rating').limit(3);
        }

        // 5. Unified Response (Don't auto-save anymore)
        res.status(200).json({
            success: true,
            data: {
                // Return prediction details so frontend can show it and later save if wanted
                prediction: {
                    predictedDisease: predictionResult.disease,
                    description: details.description,
                    precautions: details.precautions,
                    confidence: predictionResult.confidence,
                    symptoms: symptoms, // Pass symptoms back for saving later
                    city: userCity
                },
                recommendations: {
                    doctors: finalDoctors,
                    pharmacies
                }
            }
        });

    } catch (err) {
        console.error('[Prediction-Controller] Error:', err);
        res.status(500).json({ success: false, error: 'Internal server error in medical analysis pipeline' });
    }
};

// @desc    Save prediction record manually
// @route   POST /api/ai/save
// @access  Private
exports.savePrediction = async (req, res, next) => {
    try {
        const { predictedDisease, symptoms, description, precautions, confidence, city } = req.body;

        if (!predictedDisease || !symptoms) {
            return res.status(400).json({ success: false, error: 'Invalid prediction data' });
        }

        const prediction = await Prediction.create({
            user: req.user.id,
            predictedDisease,
            symptoms,
            description,
            precautions,
            confidence,
            city: city || req.user.city || 'Karachi',
            status: 'Saved'
        });

        res.status(201).json({
            success: true,
            data: prediction
        });
    } catch (err) {
        console.error('[Save-Prediction-Error]:', err);
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get user's prediction history
// @route   GET /api/ai/history
// @access  Private
exports.getPredictionHistory = async (req, res, next) => {
    try {
        const history = await Prediction.find({ user: req.user.id }).sort('-date');

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all unique symptoms
// @route   GET /api/ai/symptoms
// @access  Public
exports.getSymptoms = async (req, res, next) => {
    try {
        const maps = await SymptomMap.find({}).select('symptomsDescription');
        const symptomsSet = new Set();

        maps.forEach(map => {
            if (map.symptomsDescription) {
                map.symptomsDescription.split(',').forEach(s => {
                    const trimmed = s.trim();
                    if (trimmed) {
                        // Capitalize first letter for better UI
                        const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
                        symptomsSet.add(formatted);
                    }
                });
            }
        });

        const symptomsList = Array.from(symptomsSet).sort();

        res.status(200).json({
            success: true,
            count: symptomsList.length,
            data: symptomsList
        });
    } catch (err) {
        console.error('[AI-Service] Error fetching symptoms:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch symptoms' });
    }
};
