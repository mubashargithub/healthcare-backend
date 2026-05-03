const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CSV_FILE = path.join(__dirname, 'Doctors_in_Pakistan_Updated(1).csv');

fs.createReadStream(CSV_FILE)
    .pipe(csv())
    .on('data', (row) => {
        console.log('Keys:', Object.keys(row));
        console.log('First row value of name:', row['name']);
        process.exit(0);
    });
