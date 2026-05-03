const mongoose = require('mongoose');

const SymptomMapSchema = new mongoose.Schema({
    disease: {
        type: String,
        required: [true, 'Please add a disease name'],
        trim: true
    },
    symptomsDescription: {
        type: String,
        required: [true, 'Please add symptoms description'],
        trim: true
    }
});

// Create a text index for the symptomsDescription field to enable efficient searching
SymptomMapSchema.index({ symptomsDescription: 'text' });

module.exports = mongoose.model('SymptomMap', SymptomMapSchema);
