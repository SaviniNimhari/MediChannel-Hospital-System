const db = require('../config/db');

const getPayments = async (req, res) => {
  try {
    const query = `
      SELECT p.*, pat.full_name as patient_name, d.full_name as doctor_name, a.appointment_date
      FROM payments p
      JOIN patients pat ON p.patient_id = pat.patient_id
      JOIN appointments a ON p.appointment_id = a.appointment_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      ORDER BY p.payment_date DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createPayment = async (req, res) => {
  const { appointment_id, payment_method } = req.body;
  try {
    // 1. Find the pending payment created by the database trigger
    const paymentRes = await db.query(
      "SELECT payment_id FROM payments WHERE appointment_id = $1 AND payment_status = 'Pending'",
      [appointment_id]
    );
    
    if (paymentRes.rows.length === 0) {
      return res.status(404).json({ message: 'Pending payment not found for this appointment' });
    }
    
    const paymentId = paymentRes.rows[0].payment_id;

    // 2. Call the stored procedure to process it
    await db.query('CALL sp_process_payment($1, $2)', [paymentId, payment_method]);
    
    // 3. Fetch the updated payment to return
    const updatedPayment = await db.query('SELECT * FROM payments WHERE payment_id = $1', [paymentId]);

    res.status(201).json(updatedPayment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getPaymentsByPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM payments WHERE patient_id = $1 ORDER BY payment_date DESC',
      [patientId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getPayments, createPayment, getPaymentsByPatient };
