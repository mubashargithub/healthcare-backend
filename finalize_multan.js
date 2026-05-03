const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pharmacy = require('./models/Pharmacy');

dotenv.config();

const VERIFIED_MULTAN_PHARMACIES = [
    {
        name: "Ahsan Medicine Co.",
        address: "Nishtar Rd, Justice Hamid Colony, Multan, Punjab, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4500, 30.1900] },
        contact: "+92 61 4572527",
        isOpen24Hours: true
    },
    {
        name: "Iqbal Medical Store",
        address: "958-B, Saddar Bazar, Multan Cantt, Multan, Punjab, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4300, 30.1800] },
        contact: "+92 61 4571049",
        isOpen24Hours: false
    },
    {
        name: "Multan Medicine Bank",
        address: "Opposite Clock Tower, Ghanta Ghar, Multan, Punjab, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4700, 30.2000] },
        contact: "+92 61 4540525",
        isOpen24Hours: true
    },
    {
        name: "Al Raheem Medical Store",
        address: "Nishtar Chowk Flyover, Lalazar Colony, Multan, Punjab, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4600, 30.1950] },
        contact: "+92 61 4515019",
        isOpen24Hours: false
    },
    {
        name: "Al Saeed Pharmacy",
        address: "Near Kasab Bank, Bosan Road, Multan, Punjab, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4800, 30.2200] },
        contact: "+92 333 6668059",
        isOpen24Hours: true
    },
    {
        name: "National Pharmacy Clinic",
        address: "Opposite DHA Gate Bosan road, Bosan Road, Multan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.5000, 30.2500] },
        contact: "0311 1222398",
        isOpen24Hours: false
    },
    {
        name: "Multan Plus Pharmacy",
        address: "Bosan Rd, near Chaseup, North Gulgasht Colony, Multan, Punjab 66000, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4900, 30.2300] },
        contact: "0303 0173057",
        isOpen24Hours: true
    },
    {
        name: "Pharmacy 24",
        address: "Bosan Road, North Gulgasht Colony, Multan, 60000, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4950, 30.2350] },
        contact: "0303 8045092",
        isOpen24Hours: true
    },
    {
        name: "NMP Pharmacy",
        address: "Gulgasht Colony, Multan, Punjab, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4850, 30.2250] },
        contact: "+92 311 1333201",
        isOpen24Hours: false
    },
    {
        name: "Bio Pharma",
        address: "97 A-One Gulgasht Colony, Multan, Punjab",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4860, 30.2260] },
        contact: "061 6521444",
        isOpen24Hours: false
    },
    {
        name: "KK Mart Pharmacy",
        address: "Bosan Road, North Gulgasht Colony, Multan, Punjab, Pakistan",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4920, 30.2320] },
        contact: "0320 6660109",
        isOpen24Hours: false
    },
    {
        name: "Rehman Pharmacy Multan",
        address: "Gulgasht Colony, Multan, Punjab",
        city: "Multan",
        location: { type: 'Point', coordinates: [71.4880, 30.2280] },
        contact: "0301-1105777",
        isOpen24Hours: true
    }
];

const finalizeMultan = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Finalizing Multan pharmacies...');

        for (const p of VERIFIED_MULTAN_PHARMACIES) {
            await Pharmacy.findOneAndUpdate(
                { name: p.name, city: p.city },
                p,
                { upsert: true }
            );
        }

        const count = await Pharmacy.countDocuments({ city: 'Multan' });
        console.log(`Final Multan Pharmacy Count: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

finalizeMultan();
