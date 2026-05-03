const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

const EXPORT_FILE = path.join(__dirname, `Doctor_Backup_Manual_${new Date().toISOString().split('T')[0]}.csv`);

const exportToCSV = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Export...');

        console.log('Fetching doctor records...');
        const doctors = await Doctor.find({});
        console.log(`Found ${doctors.length} doctors.`);

        if (doctors.length === 0) {
            console.log('⚠️ No doctors found to export. Skipping file creation.');
            process.exit(0);
        }

        const headers = ['name', 'specialization', 'city', 'experience', 'rating', 'phone', 'email', 'formattedAddress'];
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const doc of doctors) {
            const row = [
                `"${doc.name || ''}"`,
                `"${doc.specialization || ''}"`,
                `"${doc.city || ''}"`,
                doc.experience || 0,
                doc.rating || 0,
                `"${doc.contact?.phone || ''}"`,
                `"${doc.contact?.email || ''}"`,
                `"${doc.location?.formattedAddress || ''}"`
            ];
            csvRows.push(row.join(','));
        }

        fs.writeFileSync(EXPORT_FILE, csvRows.join('\n'));
        console.log(`✅ Successfully exported ${doctors.length} doctors to ${EXPORT_FILE}`);
        process.exit(0);

    } catch (err) {
        console.error('❌ Export Error:', err);
        process.exit(1);
    }
};

exportToCSV();
