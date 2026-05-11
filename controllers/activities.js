const Activity = require('../models/Activity');

const User = require('../models/User');

// @desc    Log a new activity
// @route   POST /api/activities
// @access  Private
exports.logActivity = async (req, res, next) => {
    try {
        const { type, details } = req.body;

        const activity = await Activity.create({
            user: req.user.id,
            userName: req.user.name,
            type,
            details
        });

        res.status(201).json({
            success: true,
            data: activity
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all activities (for admin)
// @route   GET /api/activities
// @access  Private/Admin
exports.getActivities = async (req, res, next) => {
    try {
        const { timeframe, category, startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate || endDate) {
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateFilter.$lte = end;
            }
        } else if (timeframe && timeframe !== 'all') {
            const now = new Date();
            let start = new Date();
            if (timeframe === 'daily') {
                start.setDate(now.getDate() - 1);
            } else if (timeframe === 'monthly') {
                start.setMonth(now.getMonth() - 1);
            } else if (timeframe === 'yearly') {
                start.setFullYear(now.getFullYear() - 1);
            }
            dateFilter = { $gte: start };
        }

        let activities = [];

        if (!category || category === 'all' || category === 'prediction' || category === 'doctor_booking') {
            let actQuery = {};
            if (dateFilter.$gte) actQuery.createdAt = dateFilter;
            if (category && category !== 'all' && category !== 'user_registered') {
                actQuery.type = category;
            }

            const dbActivities = await Activity.find(actQuery).sort('-createdAt').lean();
            activities = [...dbActivities];
        }

        if (!category || category === 'all' || category === 'user_registered') {
            let userQuery = {};
            if (dateFilter.$gte) userQuery.createdAt = dateFilter;

            const users = await User.find(userQuery).select('name email createdAt').sort('-createdAt').lean();
            const userActivities = users.map(u => ({
                _id: 'u_' + u._id,
                type: 'user_registered',
                userName: u.name,
                details: { email: u.email },
                createdAt: u.createdAt
            }));
            activities = [...activities, ...userActivities];
        }

        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        activities = activities.slice(0, 100);

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get activity stats for graphs
// @route   GET /api/activities/stats
// @access  Private/Admin
exports.getActivityStats = async (req, res, next) => {
    try {
        const typeStats = await Activity.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        const dailyStats = await Activity.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
        ]);

        const monthlyStats = await Activity.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                types: typeStats,
                daily: dailyStats,
                monthly: monthlyStats
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get popular doctors based on bookings
// @route   GET /api/activities/popular-doctors
// @access  Public
exports.getPopularDoctors = async (req, res, next) => {
    try {
        const popularDoctors = await Activity.aggregate([
            { $match: { type: 'doctor_booking' } },
            {
                $group: {
                    _id: '$details.doctor.id',
                    bookingCount: { $sum: 1 },
                    name: { $first: '$details.doctor.name' },
                    specialization: { $first: '$details.doctor.specialization' }
                }
            },
            { $sort: { bookingCount: -1 } },
            { $limit: 3 }
        ]);

        res.status(200).json({
            success: true,
            data: popularDoctors
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
