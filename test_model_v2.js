const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const test = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Loading model...');
        const Doctor = require('./models/Doctor');
        console.log('Model loaded.');

        console.log('Count:', await Doctor.countDocuments());
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

test();
