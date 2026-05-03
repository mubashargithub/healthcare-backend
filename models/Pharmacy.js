const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    city: {
        type: String,
        required: [true, 'Please add city'],
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String
    },
    contact: {
        type: String,
        required: [true, 'Please add contact number']
    },
    isOpen24Hours: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);
