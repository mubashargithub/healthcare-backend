const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://healthcare-frontend-mu-brown.vercel.app'],
    credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Route files
const auth = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const doctors = require('./routes/doctors');
const pharmacies = require('./routes/pharmacies');
const ai = require('./routes/ai');
const activities = require('./routes/activities');

// Mount routers
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/auth', auth);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/doctors', doctors);
app.use('/api/pharmacies', pharmacies);
app.use('/api/ai', ai);
app.use('/api/activities', activities);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
