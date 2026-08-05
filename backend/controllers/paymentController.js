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
    const paymentRes = await db.query(
      `SELECT payment_id, payment_status
       FROM payments
       WHERE appointment_id = $1
       ORDER BY payment_id DESC
       LIMIT 1`,
      [appointment_id]
    );

    let payment = paymentRes.rows[0];

    if (!payment) {
      const appointmentRes = await db.query(
        'SELECT patient_id, doctor_id FROM appointments WHERE appointment_id = $1',
        [appointment_id]
      );

      if (appointmentRes.rows.length === 0) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      const appointment = appointmentRes.rows[0];
      const doctorFeeRes = await db.query(
        'SELECT channeling_fee FROM doctors WHERE doctor_id = $1',
        [appointment.doctor_id]
      );

      const amount = doctorFeeRes.rows[0]?.channeling_fee ?? 50.00;
      const insertedPayment = await db.query(
        `INSERT INTO payments (appointment_id, patient_id, amount, payment_method, payment_status)
         VALUES ($1, $2, $3, $4, 'Pending')
         RETURNING *`,
        [appointment_id, appointment.patient_id, amount, payment_method]
      );

      payment = insertedPayment.rows[0];
    }

    if (payment.payment_status === 'Paid') {
      return res.status(200).json(payment);
    }

    await db.query('CALL sp_process_payment($1, $2)', [payment.payment_id, payment_method]);
    const updatedPayment = await db.query('SELECT * FROM payments WHERE payment_id = $1', [payment.payment_id]);

    res.status(201).json(updatedPayment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Unable to process payment. Please try again.' });
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
