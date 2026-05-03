const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

const firstNames = ['Ahmed', 'Ali', 'Usman', 'Fatima', 'Sara', 'Zaid', 'Amna', 'Bilal', 'Hina', 'Kamran', 'Nida', 'Omar', 'Hamza', 'Ayesha', 'Zainab', 'Mustafa', 'Hassan', 'Sana', 'Ibrahim', 'Mariam'];
const lastNames = ['Khan', 'Sheikh', 'Malik', 'Qureshi', 'Siddiqui', 'Bano', 'Ejaz', 'Ali', 'Ahmed', 'Jameel', 'Lodhi', 'Shah', 'Abbasi', 'Raza', 'Farooq'];
const specializations = ['Cardiologist', 'Neurologist', 'Endocrinologist', 'General Physician', 'Dermatologist', 'Pediatrician', 'Orthopedic Surgeon', 'Gynecologist', 'Psychiatrist', 'Ophthalmologist', 'Pulmonologist', 'Gastroenterologist', 'Urologist', 'ENT Specialist', 'Dentist'];
const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Mardan', 'Sukkur'];
const hospitals = ['City Hospital', 'Al-Shifa Clinic', 'National Medical Center', 'The Aga Khan Clinic', 'Health Care Hospital', 'MediCare Unit', 'Civil Hospital', 'General Hospital', 'LifeCare Center', 'Prime Medical Complex'];

const generateDoctors = (count) => {
    const doctors = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const specialization = specializations[Math.floor(Math.random() * specializations.length)];
        const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];

        doctors.push({
            name: `Dr. ${firstName} ${lastName}`,
            specialization,
            city,
            experience: Math.floor(Math.random() * 25) + 3,
            rating: parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
            contact: {
                phone: `03${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@diagnoai.com`
            },
            location: {
                type: 'Point',
                coordinates: [
                    67.0 + Math.random() * 10, // Rough longitude for Pakistan
                    24.0 + Math.random() * 10  // Rough latitude for Pakistan
                ],
                formattedAddress: `${hospital}, Sector ${Math.floor(Math.random() * 20) + 1}, ${city}`
            }
        });
    }
    return doctors;
};

const seedBulkDocs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Bulk Seeding...');

        console.log('Generating 1000 doctor records...');
        const doctorsData = generateDoctors(1000);

        console.log('Inserting into database (this may take a few seconds)...');
        // We use insertMany for high performance
        await Doctor.insertMany(doctorsData);

        console.log('✅ Successfully added 1000 doctors to DiagnoAI!');
        process.exit();
    } catch (err) {
        console.error('❌ Bulk Seeding Error:', err);
        process.exit(1);
    }
};

seedBulkDocs();
