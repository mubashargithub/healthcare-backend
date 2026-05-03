const User = require('../models/User');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Pharmacy = require('../models/Pharmacy');

exports.getUsers = async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { city: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const users = await User.find(query);
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, city } = req.body;
        const user = await User.create({ name, email, password, city });
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.promoteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // We do raw insert to prevent double-hashing the already hashed password string
        await Admin.collection.insertOne({
            name: user.name,
            email: user.email,
            password: user.password,
            role: 'admin',
            queries: [],
            websiteMessages: [],
            createdAt: new Date()
        });

        await user.deleteOne();

        res.status(200).json({ success: true, message: 'User successfully promoted to Admin' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find({ role: 'admin' });
        res.status(200).json({ success: true, count: admins.length, data: admins });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.createAdmin = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const admin = await Admin.create({ 
            name, 
            email, 
            password, 
            role: 'admin'
        });
        res.status(201).json({ success: true, data: admin });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.revokeAdmin = async (req, res, next) => {
    try {
        const adminToRevoke = await Admin.findById(req.params.id).select('+password');
        if (!adminToRevoke) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }

        if (adminToRevoke.role === 'superadmin') {
            return res.status(403).json({ success: false, error: 'Cannot revoke a superadmin' });
        }

        // Demote back into basic User collection securely
        await User.collection.insertOne({
            name: adminToRevoke.name,
            email: adminToRevoke.email,
            password: adminToRevoke.password,
            city: 'System Admin Demotion',
            role: 'user',
            createdAt: new Date()
        });

        await adminToRevoke.deleteOne();

        res.status(200).json({ success: true, message: 'Admin successfully revoked back to User status' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deleteAdmin = async (req, res, next) => {
    try {
        const adminToDelete = await Admin.findById(req.params.id);
        if (!adminToDelete) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }

        if (adminToDelete.role === 'superadmin') {
            return res.status(403).json({ success: false, error: 'Cannot delete a superadmin' });
        }

        await adminToDelete.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Doctors Management
exports.getDoctors = async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { specialization: { $regex: search, $options: 'i' } },
                    { city: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const doctors = await Doctor.find(query);
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.createDoctor = async (req, res, next) => {
    try {
        const { name, specialization, city, experience } = req.body;
        const doctor = await Doctor.create({
            name,
            specialization,
            city,
            experience: experience || 0
        });
        res.status(201).json({ success: true, data: doctor });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updateDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: doctor });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Pharmacies Management
exports.getPharmacies = async (req, res, next) => {
    try {
        const { search, city, name, page = 1, limit = 20 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Pharmacy.countDocuments(query);
        const pharmacies = await Pharmacy.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({ 
            success: true, 
            count: pharmacies.length, 
            total,
            pages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            data: pharmacies 
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updatePharmacy = async (req, res, next) => {
    try {
        const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!pharmacy) {
            return res.status(404).json({ success: false, error: 'Pharmacy not found' });
        }
        res.status(200).json({ success: true, data: pharmacy });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deletePharmacy = async (req, res, next) => {
    try {
        const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!pharmacy) {
            return res.status(404).json({ success: false, error: 'Pharmacy not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
