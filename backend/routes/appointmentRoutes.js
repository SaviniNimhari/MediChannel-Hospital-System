const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { 
  getAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment, 
  getAppointmentsByPatient, 
  getAppointmentsByDoctor 
} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// PRIORITY ROUTES (Specific paths must come BEFORE generic :id)
router.get('/booked-slots/:doctorId', async (req, res) => {
  const { date } = req.query;
  const { doctorId } = req.params;
  try {
    const appointments = await db.query(
      "SELECT TRIM(TO_CHAR(appointment_time, 'HH24:MI')) as slot FROM appointments WHERE doctor_id = $1 AND appointment_date::date = $2::date AND appointment_status != 'Cancelled'",
      [doctorId, date]
    );
    res.json(appointments.rows.map(a => a.slot));
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/patient/:patientId', authMiddleware, getAppointmentsByPatient);
router.get('/doctor/:doctorId', authMiddleware, getAppointmentsByDoctor);

// GENERIC ROUTES
router.get('/', authMiddleware, roleMiddleware(['Admin']), getAppointments);
router.get('/:id', authMiddleware, getAppointmentById);
router.post('/', authMiddleware, createAppointment);
router.put('/:id', authMiddleware, updateAppointment);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteAppointment);

module.exports = router;
