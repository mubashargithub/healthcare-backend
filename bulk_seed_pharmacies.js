const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pharmacy = require('./models/Pharmacy');

dotenv.config();

const pharmacyPrefixes = ['Clinix', 'D-Watson', 'Shaheen', 'Servaid', 'Fazal Din', 'Green Plus', 'Ebrahim', 'MedPlus', 'Health First', 'Quick Care', 'Life Care', 'Standard', 'Universal', 'National', 'The Chemist'];
const pharmacySuffixes = ['Pharmacy', 'Chemist', 'Medical Store', 'Healthcare', 'Pharma', 'Clinic & Pharmacy'];
const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Mardan', 'Sukkur'];
const areas = ['DHA Phase 1', 'Gulshan-e-Iqbal', 'Saddar', 'Blue Area', 'Liberty Market', 'Susan Road', 'Cantt', 'Model Town', 'Satellite Town', 'Civic Center'];

const generatePharmacies = (count) => {
    const pharmacies = [];
    for (let i = 0; i < count; i++) {
        const prefix = pharmacyPrefixes[Math.floor(Math.random() * pharmacyPrefixes.length)];
        const suffix = pharmacySuffixes[Math.floor(Math.random() * pharmacySuffixes.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const area = areas[Math.floor(Math.random() * areas.length)];

        pharmacies.push({
            name: `${prefix} ${suffix} ${i + 1}`,
            address: `${area}, Street ${Math.floor(Math.random() * 50) + 1}, ${city}`,
            city,
            location: {
                type: 'Point',
                coordinates: [
                    67.0 + Math.random() * 10,
                    24.0 + Math.random() * 10
                ],
                formattedAddress: `${prefix} ${suffix}, ${area}, ${city}`
            },
            contact: `0${Math.floor(21 + Math.random() * 70)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
            isOpen24Hours: Math.random() > 0.5
        });
    }
    return pharmacies;
};

const seedBulkPharmacies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Bulk Pharmacy Seeding...');

        console.log('Generating 3000 pharmacy records...');
        const pharmaciesData = generatePharmacies(3000);

        console.log('Inserting into database (batch processing for performance)...');
        // Clear existing pharmacies first if you want, or just append
        // await Pharmacy.deleteMany(); // Uncomment if you want to clear old ones

        const chunkSize = 500;
        for (let i = 0; i < pharmaciesData.length; i += chunkSize) {
            const chunk = pharmaciesData.slice(i, i + chunkSize);
            await Pharmacy.insertMany(chunk);
            console.log(`Inserted ${i + chunk.length} / 3000`);
        }

        console.log('✅ Successfully added 3000 pharmacies to DiagnoAI!');
        process.exit();
    } catch (err) {
        console.error('❌ Bulk Seeding Error:', err);
        process.exit(1);
    }
};

seedBulkPharmacies();
