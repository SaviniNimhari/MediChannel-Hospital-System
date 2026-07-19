const express = require('express');
const router = express.Router();
const { getPayments, createPayment, getPaymentsByPatient } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['Admin']), getPayments);
router.post('/', authMiddleware, createPayment);
router.get('/patient/:patientId', authMiddleware, getPaymentsByPatient);

module.exports = router;
