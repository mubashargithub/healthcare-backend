const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SymptomMap = require('./models/SymptomMap');

dotenv.config();

const EXPORT_FILE = path.join(__dirname, `Disease_Backup_${new Date().toISOString().split('T')[0]}.csv`);

const exportToCSV = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Disease Export...');

        console.log('Fetching disease records...');
        const maps = await SymptomMap.find({});
        console.log(`Found ${maps.length} records.`);

        if (maps.length === 0) {
            console.log('⚠️ No disease records found to export.');
            process.exit(0);
        }

        const headers = ['disease', 'symptomsDescription'];
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const map of maps) {
            const row = [
                `"${map.disease || ''}"`,
                `"${(map.symptomsDescription || '').replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(','));
        }

        fs.writeFileSync(EXPORT_FILE, csvRows.join('\n'));
        console.log(`✅ Successfully exported ${maps.length} records to ${EXPORT_FILE}`);
        process.exit(0);

    } catch (err) {
        console.error('❌ Export Error:', err);
        process.exit(1);
    }
};

exportToCSV();
