const db = require('../config/db');

const getAppointments = async (req, res) => {
  try {
    const query = `
      SELECT a.*, p.full_name as patient_name, d.full_name as doctor_name, dept.department_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      LEFT JOIN departments dept ON d.department_id = dept.department_id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT a.*, p.full_name as patient_name, d.full_name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      WHERE a.appointment_id = $1
    `;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Appointment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, reason, payment_method = 'Card' } = req.body;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const appointmentResult = await client.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, appointment_status, reason)
       VALUES ($1, $2, $3, $4, 'Pending', $5)
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, appointment_time, reason]
    );

    const appointment = appointmentResult.rows[0];

    const doctorFeeResult = await client.query(
      'SELECT channeling_fee FROM doctors WHERE doctor_id = $1',
      [doctor_id]
    );

    const amount = doctorFeeResult.rows[0]?.channeling_fee ?? 50.00;

    await client.query(
      `INSERT INTO payments (appointment_id, patient_id, amount, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, 'Pending')`,
      [appointment.appointment_id, patient_id, amount, payment_method]
    );

    await client.query('COMMIT');
    res.status(201).json(appointment);
  } catch (err) {
    await client.query('ROLLBACK');
    
    console.error(err.message);
    if (err.message.includes('Doctor is not available') || err.message.includes('already booked')) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Unable to create appointment. Please try again.' });
  } finally {
    client.release();
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { appointment_status, appointment_date, appointment_time, reason } = req.body;
  try {
    if (appointment_status === 'Cancelled') {
      await db.query('CALL sp_cancel_appointment($1)', [id]);
    } else if (appointment_status === 'Completed') {
      await db.query('CALL sp_complete_appointment($1)', [id]);
    } else {
      await db.query(
        `UPDATE appointments SET appointment_status = COALESCE($1, appointment_status), 
        appointment_date = COALESCE($2, appointment_date), 
        appointment_time = COALESCE($3, appointment_time),
        reason = COALESCE($4, reason)
        WHERE appointment_id = $5`,
        [appointment_status, appointment_date, appointment_time, reason, id]
      );
    }
    const result = await db.query('SELECT * FROM appointments WHERE appointment_id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM appointments WHERE appointment_id = $1', [id]);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAppointmentsByPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const query = `
      SELECT a.*, d.full_name as doctor_name, dept.department_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.doctor_id
      LEFT JOIN departments dept ON d.department_id = dept.department_id
      WHERE a.patient_id = $1
      ORDER BY a.appointment_date DESC
    `;
    const result = await db.query(query, [patientId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const query = `
      SELECT a.*, p.full_name as patient_name, p.phone as patient_phone, p.age, p.gender, p.medical_history
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
    `;
    const result = await db.query(query, [doctorId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { 
  getAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment, 
  getAppointmentsByPatient, 
  getAppointmentsByDoctor 
};
