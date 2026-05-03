const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const Doctor = require('./models/Doctor');
    const docs = await Doctor.find({});
    
    const count = docs.length;
    console.log(`Total doctors: ${count}`);
    
    // Check duplicates by name + city
    const seen = new Set();
    let duplicates = 0;
    
    for (let doc of docs) {
        const key = `${doc.name}-${doc.city}-${doc.specialization}`;
        if (seen.has(key)) {
            duplicates++;
        } else {
            seen.add(key);
        }
    }
    
    console.log(`Duplicates: ${duplicates}`);
    process.exit(0);
});
