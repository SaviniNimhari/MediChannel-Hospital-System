const express = require('express');
const router = express.Router();
const { getPatients, getPatientById, addPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['Admin']), getPatients);
router.get('/:id', authMiddleware, getPatientById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), addPatient);
router.put('/:id', authMiddleware, updatePatient);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deletePatient);

module.exports = router;
