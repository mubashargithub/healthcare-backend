const express = require('express');
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    promoteUser,
    getAdmins,
    createAdmin,
    revokeAdmin,
    deleteAdmin,
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getPharmacies,
    updatePharmacy,
    deletePharmacy
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Allow both admin and superadmin to view/manage standard users, doctors, and pharmacies
router.use(authorize('admin', 'superadmin'));

router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.route('/users/:id/promote')
    .put(promoteUser);

// Doctors routes
router.route('/doctors')
    .get(getDoctors)
    .post(createDoctor);

router.route('/doctors/:id')
    .put(updateDoctor)
    .delete(deleteDoctor);

// Pharmacies routes
router.route('/pharmacies')
    .get(getPharmacies);

router.route('/pharmacies/:id')
    .put(updatePharmacy)
    .delete(deletePharmacy);

// Superadmin Exclusive Pathways
router.use(authorize('superadmin'));

router.route('/admins')
    .get(getAdmins)
    .post(createAdmin);

router.route('/admins/:id')
    .delete(deleteAdmin);

router.route('/admins/:id/revoke')
    .put(revokeAdmin);

module.exports = router;
