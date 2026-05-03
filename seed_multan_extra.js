const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pharmacy = require('./models/Pharmacy');

dotenv.config();

const FILE_PATH = path.join(__dirname, 'multan_pharmacy_data.csv');

const seedExtraMultan = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Extra Multan Seeding...');

        const content = fs.readFileSync(FILE_PATH, 'utf8');

        // Split by "Directions" which appears at the end of each block
        const chunks = content.split('Directions');

        const pharmacies = [];

        chunks.forEach((chunk) => {
            const lines = chunk.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);

            if (lines.length < 2) return;

            let name = '';
            let address = 'Multan, Pakistan';
            let contact = 'N/A';
            let isOpen24Hours = false;

            // Simple heuristic based on typical Google Maps capture:
            // Line 0 is usually name
            name = lines[0].replace(/^"|"$/g, '').trim();

            // Skip common metadata headers or noise
            if (name === 'Results' || name === 'Share' || name === '' || name === 'Website') return;

            // Search for phone and address in the remaining lines
            lines.forEach((line) => {
                // Phone match: +92 followed by digits
                if (line.includes('+92')) {
                    const phoneMatch = line.match(/\+92\s?(\d{3,4})\s?(\d{7})/);
                    if (phoneMatch) {
                        contact = phoneMatch[0];
                    } else if (line.split('·').length > 1) {
                        // Sometimes phone is at the end of a line with dots
                        const parts = line.split('·').map(p => p.trim());
                        const possiblePhone = parts.find(p => p.startsWith('+92'));
                        if (possiblePhone) contact = possiblePhone;
                    }
                }

                // 24 Hours check
                if (line.toLowerCase().includes('24 hours')) {
                    isOpen24Hours = true;
                }

                // Address extraction (Heuristic: Line starting with "Pharmacy ·" or containing address-like markers)
                if (line.includes('·') && !line.includes('+92')) {
                    const parts = line.split('·').map(p => p.trim());
                    // Usually "Pharmacy · Address" or "Pharmacy ·  · Address"
                    if (parts.length > 1) {
                        // Filter out the category "Pharmacy"
                        const addrPart = parts.find(p => p !== 'Pharmacy' && p !== '·' && p !== '' && p.length > 5);
                        if (addrPart) {
                            address = addrPart + ', Multan';
                        }
                    }
                }
            });

            if (name && contact !== 'N/A') {
                pharmacies.push({
                    name,
                    address,
                    city: 'Multan',
                    contact,
                    isOpen24Hours,
                    location: {
                        type: 'Point',
                        coordinates: [71.4589, 30.1575] // Default Multan coordinates
                    }
                });
            }
        });

        console.log(`Parsed ${pharmacies.length} pharmacies from file.`);

        let addedCount = 0;
        for (const p of pharmacies) {
            // Upsert based on name and contact to prevent duplicates
            const existing = await Pharmacy.findOne({ name: p.name, contact: p.contact });
            if (!existing) {
                await Pharmacy.create(p);
                addedCount++;
            }
        }

        console.log(`✅ Successfully added ${addedCount} new pharmacies for Multan!`);
        process.exit(0);

    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    }
};

seedExtraMultan();
