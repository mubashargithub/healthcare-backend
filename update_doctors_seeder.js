const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const CSV_FILE = path.join(__dirname, 'Doctors_in_Pakistan_Updated(1).csv');

const extractCity = (locationStr) => {
    if (!locationStr) return 'Unknown';
    const parts = locationStr.split(',').map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length === 0) return 'Unknown';

    let city = parts[parts.length - 1].replace(/\.$/, '').trim();

    // Normalize common cities
    const lowerCity = city.toLowerCase();
    if (lowerCity.includes('karachi')) return 'Karachi';
    if (lowerCity.includes('lahore')) return 'Lahore';
    if (lowerCity.includes('islamabad')) return 'Islamabad';
    if (lowerCity.includes('multan')) return 'Multan';
    if (lowerCity.includes('rawalpindi')) return 'Rawalpindi';
    if (lowerCity.includes('faisalabad')) return 'Faisalabad';
    if (lowerCity.includes('peshawar')) return 'Peshawar';
    if (lowerCity.includes('quetta')) return 'Quetta';

    return city;
};

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        // Lazy load model to avoid issues seen in tests
        const Doctor = require('./models/Doctor');

        console.log('🗑️ Purging existing Doctors collection...');
        const del = await Doctor.deleteMany({});
        console.log(`✅ Deleted ${del.deletedCount} old records.`);

        const doctorsData = [];
        console.log(`Reading CSV: ${CSV_FILE}`);

        fs.createReadStream(CSV_FILE)
            .pipe(csv({
                mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, '')
            }))
            .on('data', (row) => {
                const city = extractCity(row.location);

                // Map specialization
                let spec = row.speciality || row.designation || 'General Physician';
                spec = spec.split(',')[0].split('|').pop().trim();
                if (spec === 'N/A' || !spec) spec = 'General Physician';

                doctorsData.push({
                    name: row.name ? row.name.trim() : 'Unknown Doctor',
                    specialization: spec,
                    city: city,
                    experience: Math.floor(Math.random() * 20) + 5,
                    rating: parseFloat((Math.random() * 1.2 + 3.8).toFixed(1)),
                    contact: {
                        phone: `03${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000000 + 1000000)}`,
                        email: `doctor.${Math.random().toString(36).substring(7)}@diagnoai.pk`
                    },
                    location: {
                        type: 'Point',
                        coordinates: [
                            67.0 + Math.random() * 7,
                            24.0 + Math.random() * 10
                        ],
                        formattedAddress: row.location ? row.location.trim() : 'Address not specified'
                    }
                });
            })
            .on('end', async () => {
                console.log(`Parsed ${doctorsData.length} records. Inserting...`);
                if (doctorsData.length > 0) {
                    try {
                        const result = await Doctor.insertMany(doctorsData);
                        console.log(`✅ Successfully seeded ${result.length} doctors!`);
                        process.exit(0);
                    } catch (err) {
                        console.error('❌ Insert error:', err.message);
                        process.exit(1);
                    }
                } else {
                    console.log('⚠️ No data to insert.');
                    process.exit(0);
                }
            })
            .on('error', (err) => {
                console.error('❌ CSV Stream Error:', err.message);
                process.exit(1);
            });

    } catch (err) {
        console.error('❌ Critical Error:', err.message);
        process.exit(1);
    }
};

run();
