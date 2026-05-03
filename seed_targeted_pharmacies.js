const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pharmacy = require('./models/Pharmacy');

dotenv.config();

const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Mardan', 'Sukkur'];
const pharmacyNames = ['MediLink', 'HealthGuard', 'LifeSource', 'CityPharma', 'Pulse Pharmacy', 'CarePlus Medical', 'The Hive Pharmacy', 'Global Health Store', 'Wellness Point', 'Apex Chemist'];
const addresses = ['Main Commercial Area', 'Saddar Bazar', 'Sector G-10', 'Model Town Block C', 'Gulberg Road', 'Mall Road', 'University Road', 'Satellite Town Phase 1', 'Defence Housing Authority', 'Civic Center'];

const seedTargetedPharmacies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Targeted Seeding...');

        const pharmaciesToInsert = [];

        cities.forEach(city => {
            for (let i = 0; i < 10; i++) {
                const name = pharmacyNames[i % pharmacyNames.length];
                const address = addresses[i % addresses.length];

                pharmaciesToInsert.push({
                    name: `${name} - ${city} Unit ${i + 1}`,
                    address: `${address}, ${city}`,
                    city: city,
                    location: {
                        type: 'Point',
                        coordinates: [
                            67.0 + Math.random() * 5, // Rough Pak coordinates
                            24.0 + Math.random() * 5
                        ],
                        formattedAddress: `${name}, ${address}, ${city}`
                    },
                    contact: `0${Math.floor(21 + Math.random() * 70)}-888${Math.floor(1000 + Math.random() * 9000)}`,
                    isOpen24Hours: true
                });
            }
        });

        console.log(`Inserting 150 targeted pharmacies (10 per city for ${cities.length} cities)...`);
        await Pharmacy.insertMany(pharmaciesToInsert);

        console.log('✅ Targeted Pharmacy Seeding SUCCESS!');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seedTargetedPharmacies();
