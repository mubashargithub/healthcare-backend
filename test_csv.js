const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CSV_FILE = path.join(__dirname, 'Doctors_in_Pakistan_Updated(1).csv');

const extractCity = (locationStr) => {
    if (!locationStr) return 'Unknown';
    const parts = locationStr.split(',').map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length === 0) return 'Unknown';
    let city = parts[parts.length - 1];
    city = city.replace(/\.$/, '').trim();
    return city;
};

let count = 0;
fs.createReadStream(CSV_FILE)
    .pipe(csv())
    .on('data', (row) => {
        if (count < 3) {
            const city = extractCity(row.location);
            let specialization = row.speciality ? row.speciality.trim() : 'General Physician';
            console.log('Processed row:', {
                name: row.name,
                specialization,
                city,
                address: row.location
            });
        }
        count++;
    })
    .on('end', () => {
        console.log('Total rows:', count);
        process.exit(0);
    });
