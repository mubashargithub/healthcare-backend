const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Starting connection test...');
console.log('URI present:', !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err);
        process.exit(1);
    });
