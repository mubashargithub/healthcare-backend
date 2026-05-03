const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

const CSV_FILE = path.join(__dirname, 'Doctors_in_Pakistancsv.csv');

const extractCity = (locationStr) => {
    if (!locationStr) return 'Unknown';
    // Locations usually end with ", City"
    const parts = locationStr.split(',').map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length === 0) return 'Unknown';
    return parts[parts.length - 1];
};

const seedFromCSV = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for CSV Seeding...');

        // Clear existing doctors
        console.log('Clearing existing doctor records...');
        await Doctor.deleteMany();

        const doctorsData = [];

        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', (row) => {
                const city = extractCity(row.location);

                // Map specialization (speciality column, fallback to designation or default)
                let specialization = row.speciality ? row.speciality.trim() : '';
                if (!specialization && row.designation) {
                    specialization = row.designation.trim();
                }
                if (!specialization || specialization === 'N/A') {
                    specialization = 'General Physician';
                }

                // Handle multi-speciality (take first if comma separated)
                specialization = specialization.split(',')[0].trim();

                doctorsData.push({
                    name: row.name.trim(),
                    specialization: specialization,
                    city: city,
                    experience: Math.floor(Math.random() * 22) + 3, // 3 to 25 years
                    rating: parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
                    contact: {
                        phone: `03${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
                        email: `${row.name.toLowerCase().replace(/[^a-z]/g, '.')}${Math.floor(Math.random() * 1000)}@diagnoai.com`
                    },
                    location: {
                        type: 'Point',
                        coordinates: [
                            67.0 + Math.random() * 10, // Rough longitude for Pakistan
                            24.0 + Math.random() * 10  // Rough latitude for Pakistan
                        ],
                        formattedAddress: row.location.trim()
                    }
                });
            })
            .on('end', async () => {
                console.log(`Parsed ${doctorsData.length} doctors from CSV.`);

                try {
                    console.log('Inserting into database...');
                    // Use larger batch size if needed, but insertMany handles arrays well
                    await Doctor.insertMany(doctorsData);
                    console.log('✅ Successfully seeded doctors from CSV!');
                    process.exit(0);
                } catch (err) {
                    console.error('❌ Insertion Error:', err);
                    process.exit(1);
                }
            });

    } catch (err) {
        console.error('❌ Connection Error:', err);
        process.exit(1);
    }
};

seedFromCSV();
