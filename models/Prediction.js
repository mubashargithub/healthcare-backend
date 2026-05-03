const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: {
        type: [String],
        required: [true, 'Please add symptoms']
    },
    predictedDisease: {
        type: String,
        required: [true, 'Please add predicted disease']
    },
    description: {
        type: String,
        default: 'No further description available.'
    },
    precautions: {
        type: [String],
        default: []
    },
    confidence: {
        type: Number,
        required: [true, 'Please add confidence levels']
    },
    city: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Analyzed'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
