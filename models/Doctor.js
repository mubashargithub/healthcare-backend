const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    specialization: {
        type: String,
        required: [true, 'Please add specialization'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'Please add city'],
        trim: true
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        zipcode: String
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5'],
        default: 4.5
    },
    contact: {
        phone: String,
        email: String
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
