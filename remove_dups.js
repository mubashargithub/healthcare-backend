const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const Doctor = require('./models/Doctor');
    const docs = await Doctor.find({});
    
    const seen = new Set();
    const toDelete = [];
    
    for (let doc of docs) {
        // Group by name, city, and specialization to identify duplicates
        const key = `${doc.name}-${doc.city}-${doc.specialization}`;
        if (seen.has(key)) {
            toDelete.push(doc._id);
        } else {
            seen.add(key);
        }
    }
    
    if (toDelete.length > 0) {
        await Doctor.deleteMany({ _id: { $in: toDelete } });
        console.log(`Deleted ${toDelete.length} duplicate doctors.`);
    } else {
        console.log('No duplicates found.');
    }
    
    process.exit(0);
});
