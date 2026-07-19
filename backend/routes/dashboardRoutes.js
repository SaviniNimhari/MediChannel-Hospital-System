const express = require('express');
const router = express.Router();
const { getAdminStats, getDoctorStats, getPatientStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/admin', authMiddleware, roleMiddleware(['Admin']), getAdminStats);
router.get('/doctor/:doctorId', authMiddleware, roleMiddleware(['Doctor', 'Admin']), getDoctorStats);
router.get('/patient/:patientId', authMiddleware, roleMiddleware(['Patient', 'Admin']), getPatientStats);

module.exports = router;
