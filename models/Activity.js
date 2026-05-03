const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    userName: String,
    type: {
        type: String,
        enum: ['prediction', 'doctor_booking', 'pharmacy_interaction'],
        required: true
    },
    details: {
        prediction: {
            disease: String,
            confidence: Number,
            symptoms: [String]
        },
        doctor: {
            id: String,
            name: String,
            specialization: String
        },
        pharmacy: {
            id: String,
            name: String,
            address: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
