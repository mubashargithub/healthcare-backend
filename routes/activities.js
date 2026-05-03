const express = require('express');
const { logActivity, getActivities, getActivityStats, getPopularDoctors } = require('../controllers/activities');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, logActivity);
router.get('/', protect, authorize('admin', 'superadmin'), getActivities);
router.get('/stats', protect, authorize('admin', 'superadmin'), getActivityStats);
router.get('/popular-doctors', getPopularDoctors);

module.exports = router;
