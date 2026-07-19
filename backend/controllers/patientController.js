const db = require('../config/db');
const bcrypt = require('bcrypt');

const getPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM patients WHERE patient_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Patient not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const addPatient = async (req, res) => {
  const { full_name, email, password, age, gender, phone, address, medical_history } = req.body;
  try {
    // 1. Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRes = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id',
      [full_name, email, hashedPassword, 'Patient']
    );
    const userId = userRes.rows[0].user_id;

    // 2. Create Patient Profile
    const patientRes = await db.query(
      'INSERT INTO patients (user_id, full_name, age, gender, phone, address, medical_history) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, full_name, age, gender, phone, address, medical_history]
    );
    res.status(201).json(patientRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { full_name, age, gender, phone, address, medical_history } = req.body;
  try {
    const oldPatientRes = await db.query('SELECT medical_history FROM patients WHERE patient_id = $1', [id]);
    const oldHistory = oldPatientRes.rows[0].medical_history || '';

    let result = await db.query(
      'UPDATE patients SET full_name = $1, age = $2, gender = $3, phone = $4, address = $5 WHERE patient_id = $6 RETURNING *',
      [full_name, age, gender, phone, address, id]
    );

    let newNote = medical_history;
    if (medical_history && medical_history !== oldHistory) {
      if (oldHistory && medical_history.startsWith(oldHistory)) {
        newNote = medical_history.substring(oldHistory.length).trim();
      }
      if (newNote) {
        await db.query('CALL sp_update_medical_history($1, $2)', [id, newNote]);
        result = await db.query('SELECT * FROM patients WHERE patient_id = $1', [id]);
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patientRes = await db.query('SELECT user_id FROM patients WHERE patient_id = $1', [id]);
    if (patientRes.rows.length > 0) {
      const userId = patientRes.rows[0].user_id;
      // Deleting user will cascade to patient profile due to foreign key
      await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
    }
    res.json({ message: 'Patient and associated user deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getPatients, getPatientById, addPatient, updatePatient, deletePatient };
