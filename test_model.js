const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Count before:', await Doctor.countDocuments());

        // Don't actually delete yet, just test the model
        const doc = await Doctor.findOne();
        console.log('Found one:', !!doc);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

test();
