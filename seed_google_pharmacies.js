const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pharmacy = require('./models/Pharmacy');

dotenv.config();

const CSV_FILE = path.join(__dirname, 'multan_google_maps_pharmacies.csv');

const seedGooglePharmacies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Google Maps Pharmacy Seeding...');

        const pharmacies = [];

        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', (row) => {
                if (row.name && row.name !== 'name') {
                    pharmacies.push({
                        name: row.name.trim(),
                        address: row.address.trim(),
                        city: 'Multan',
                        contact: row.contact.trim() === 'N/A' ? 'Not Provided' : row.contact.trim(),
                        location: {
                            type: 'Point',
                            coordinates: [71.4589, 30.1575] // Multan Center
                        }
                    });
                }
            })
            .on('end', async () => {
                console.log(`Parsed ${pharmacies.length} pharmacies from Google Maps CSV.`);

                let addedCount = 0;
                for (const p of pharmacies) {
                    // Check for duplicates
                    const existing = await Pharmacy.findOne({ name: p.name, city: 'Multan' });
                    if (!existing) {
                        await Pharmacy.create(p);
                        addedCount++;
                    }
                }

                console.log(`✅ Successfully added ${addedCount} new pharmacies from Google Maps!`);
                process.exit(0);
            });

    } catch (err) {
        console.error('❌ Connection Error:', err);
        process.exit(1);
    }
};

seedGooglePharmacies();
