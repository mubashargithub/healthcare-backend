const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SymptomMap = require('./models/SymptomMap');

dotenv.config();

const CSV_FILE = path.join(__dirname, 'Symptom_to_Disease.csv');

const seedSymptomMap = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Symptom Mapping Seeding...');

        // Clear existing mappings
        console.log('Clearing existing symptom mapping records...');
        await SymptomMap.deleteMany();

        const mappingsData = [];

        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', (row) => {
                // The CSV columns are: ,label,text
                // row.label is the disease
                // row.text is the symptoms description
                if (row.label && row.text) {
                    mappingsData.push({
                        disease: row.label.trim(),
                        symptomsDescription: row.text.trim()
                    });
                }
            })
            .on('end', async () => {
                console.log(`Parsed ${mappingsData.length} mappings from CSV.`);

                try {
                    console.log('Inserting into database in batches...');
                    const chunkSize = 500;
                    for (let i = 0; i < mappingsData.length; i += chunkSize) {
                        const chunk = mappingsData.slice(i, i + chunkSize);
                        await SymptomMap.insertMany(chunk);
                        console.log(`Inserted ${i + chunk.length} / ${mappingsData.length}`);
                    }
                    console.log('✅ Successfully seeded symptom mappings!');
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

seedSymptomMap();
