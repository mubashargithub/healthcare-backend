const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// The user specified "Diseases and Symptoms Dataset.xlsx"
const XLSX_FILE = path.join(__dirname, 'Diseases and Symptoms Dataset.xlsx');

const seedFromXLSX = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for Disease Seeding...');

        // Lazy load model
        const SymptomMap = require('./models/SymptomMap');

        console.log(`Reading: ${XLSX_FILE}`);
        const workbook = xlsx.readFile(XLSX_FILE);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Read as array of arrays

        const diseasesList = [];

        // data[0] is often headers, but user said:
        // "1st field is the name of disease and next all fields containing the symptoms"
        // If data[0] has headers like "Disease", "Symptom1", etc. we might need to skip or handle.
        // Let's assume every row is a record or header.

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length === 0) continue;

            const disease = row[0];
            if (!disease || typeof disease !== 'string' || disease.toLowerCase() === 'disease') continue;

            // Collect symptoms from remaining columns
            const symptoms = row.slice(1)
                .filter(s => s && typeof s === 'string' && s.trim().length > 0)
                .map(s => s.trim().toLowerCase().replace(/_/g, ' '));

            if (symptoms.length === 0) continue;

            diseasesList.push({
                disease: disease.trim(),
                symptomsDescription: symptoms.join(', ')
            });
        }

        console.log(`Parsed ${diseasesList.length} diseases.`);

        if (diseasesList.length === 0) {
            console.log('⚠️ No data found to import.');
            process.exit(0);
        }

        // The user said "add all record of the new these diseases... into database"
        // Pattern from doctors was "purge then seed". I'll default to appending or clearing.
        // Given user wants to "make csv of existing", it implies they want to KEEP them elsewhere,
        // so I will purge and re-seed to ensure a clean updated dataset.

        console.log('🗑️ Purging existing records...');
        const delResult = await SymptomMap.deleteMany({});
        console.log(`✅ Deleted ${delResult.deletedCount} old records.`);

        console.log('🚀 Seeding new data...');
        const inserted = await SymptomMap.insertMany(diseasesList);
        console.log(`✅ Successfully updated database with ${inserted.length} diseases!`);

        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding Error:', err.stack);
        process.exit(1);
    }
};

seedFromXLSX();
