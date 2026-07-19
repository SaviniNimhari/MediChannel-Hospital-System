const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, addDoctor, updateDoctor, deleteDoctor, searchDoctors } = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getDoctors);
router.get('/search', searchDoctors);
router.get('/:id', getDoctorById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), addDoctor);
router.put('/:id', authMiddleware, updateDoctor);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteDoctor);

module.exports = router;
