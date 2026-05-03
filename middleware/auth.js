const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === 'admin' || decoded.role === 'superadmin') {
            req.user = await Admin.findById(decoded.id);
        } else {
            req.user = await User.findById(decoded.id);
        }

        if (!req.user) {
            return res.status(401).json({ success: false, error: 'User not found in system' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Assume default 'user' if role is not present directly on user object
        const userRole = req.user.role || 'user';
        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                error: `User role ${userRole} is not authorized to access this route`
            });
        }
        next();
    };
};
