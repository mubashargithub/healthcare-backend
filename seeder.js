const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const Pharmacy = require('./models/Pharmacy');

dotenv.config();

const doctors = [
    {
        name: "Dr. Ahmed Khan",
        specialization: "Cardiologist",
        city: "Karachi",
        experience: 15,
        rating: 4.8,
        contact: { phone: "0300-1112233", email: "ahmed.khan@diagnoai.com" }
    },
    {
        name: "Dr. Sara Ali",
        specialization: "Neurologist",
        city: "Lahore",
        experience: 10,
        rating: 4.9,
        contact: { phone: "0321-4455667", email: "sara.ali@diagnoai.com" }
    },
    {
        name: "Dr. Usman Sheikh",
        specialization: "Endocrinologist",
        city: "Islamabad",
        experience: 12,
        rating: 4.7,
        contact: { phone: "0333-7788990", email: "usman.s@diagnoai.com" }
    },
    {
        name: "Dr. Fatima Zahra",
        specialization: "General Physician",
        city: "Rawalpindi",
        experience: 8,
        rating: 4.5,
        contact: { phone: "0312-0001122", email: "fatima.z@diagnoai.com" }
    },
    {
        name: "Dr. Zaid Malik",
        specialization: "Dermatologist",
        city: "Karachi",
        experience: 7,
        rating: 4.6,
        contact: { phone: "0301-2223344", email: "zaid.m@diagnoai.com" }
    },
    {
        name: "Dr. Amna Qureshi",
        specialization: "Pediatrician",
        city: "Lahore",
        experience: 14,
        rating: 4.8,
        contact: { phone: "0322-5556677", email: "amna.q@diagnoai.com" }
    },
    {
        name: "Dr. Bilal Siddiqui",
        specialization: "Orthopedic Surgeon",
        city: "Faisalabad",
        experience: 20,
        rating: 4.9,
        contact: { phone: "0345-8889900", email: "bilal.s@diagnoai.com" }
    },
    {
        name: "Dr. Hina Bano",
        specialization: "Gynecologist",
        city: "Multan",
        experience: 9,
        rating: 4.7,
        contact: { phone: "0300-3334455", email: "hina.b@diagnoai.com" }
    },
    {
        name: "Dr. Kamran Jameel",
        specialization: "Psychiatrist",
        city: "Peshawar",
        experience: 11,
        rating: 4.4,
        contact: { phone: "0311-6667788", email: "kamran.j@diagnoai.com" }
    },
    {
        name: "Dr. Nida Ejaz",
        specialization: "Ophthalmologist",
        city: "Quetta",
        experience: 6,
        rating: 4.3,
        contact: { phone: "0333-1110099", email: "nida.e@diagnoai.com" }
    }
];

const pharmacies = [
    {
        name: "D-Watson Pharmacy",
        address: "Blue Area, Islamabad",
        city: "Islamabad",
        contact: "051-2270031",
        isOpen24Hours: true
    },
    {
        name: "Clinix Pharmacy",
        address: "DHA Phase 5, Karachi",
        city: "Karachi",
        contact: "021-35345678",
        isOpen24Hours: true
    },
    {
        name: "Fazal Din's Pharma",
        address: "Liberty Market, Lahore",
        city: "Lahore",
        contact: "042-35756677",
        isOpen24Hours: true
    },
    {
        name: "Shaheen Chemist",
        address: "Saddar, Rawalpindi",
        city: "Rawalpindi",
        contact: "051-5566778",
        isOpen24Hours: true
    },
    {
        name: "Servaid Pharmacy",
        address: "Susan Road, Faisalabad",
        city: "Faisalabad",
        contact: "041-8556677",
        isOpen24Hours: true
    },
    {
        name: "Green Plus Pharmacy",
        address: "Cantt, Multan",
        city: "Multan",
        contact: "061-4556677",
        isOpen24Hours: false
    },
    {
        name: "Ebrahim Chemist",
        address: "Garden, Karachi",
        city: "Karachi",
        contact: "021-32211223",
        isOpen24Hours: false
    },
    {
        name: "MedPlus Pharmacy",
        address: "Gulberg, Lahore",
        city: "Lahore",
        contact: "042-35871122",
        isOpen24Hours: true
    },
    {
        name: "Health First Pharmacy",
        address: "University Road, Peshawar",
        city: "Peshawar",
        contact: "091-5841122",
        isOpen24Hours: false
    },
    {
        name: "Quick Care Pharmacy",
        address: "Suraj Ganj Bazaar, Quetta",
        city: "Quetta",
        contact: "081-2283344",
        isOpen24Hours: false
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        await Doctor.deleteMany();
        await Pharmacy.deleteMany();

        await Doctor.insertMany(doctors);
        await Pharmacy.insertMany(pharmacies);

        console.log('✅ Data Seeded Successfully with Pakistani records!');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
