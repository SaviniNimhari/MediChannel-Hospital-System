const db = require('../config/db');
const bcrypt = require('bcrypt');

const getDoctors = async (req, res) => {
  try {
    const query = `
      SELECT d.*, dept.department_name 
      FROM doctors d 
      LEFT JOIN departments dept ON d.department_id = dept.department_id 
      ORDER BY d.full_name ASC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT d.*, dept.department_name 
      FROM doctors d 
      LEFT JOIN departments dept ON d.department_id = dept.department_id 
      WHERE d.doctor_id = $1
    `;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const addDoctor = async (req, res) => {
  const { full_name, email, password, department_id, specialization, qualification, phone, available_days, available_time, channeling_fee } = req.body;
  try {
    // 1. Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRes = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id',
      [full_name, email, hashedPassword, 'Doctor']
    );
    const userId = userRes.rows[0].user_id;

    // 2. Create Doctor Profile
    const doctorRes = await db.query(
      `INSERT INTO doctors 
      (user_id, department_id, full_name, specialization, qualification, phone, email, available_days, available_time, channeling_fee) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [userId, department_id, full_name, specialization, qualification, phone, email, available_days, available_time, channeling_fee]
    );
    res.status(201).json(doctorRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { full_name, department_id, specialization, qualification, phone, email, available_days, available_time, channeling_fee } = req.body;
  try {
    const result = await db.query(
      `UPDATE doctors SET 
      full_name = $1, department_id = $2, specialization = $3, qualification = $4, phone = $5, email = $6, available_days = $7, available_time = $8, channeling_fee = $9 
      WHERE doctor_id = $10 RETURNING *`,
      [full_name, department_id, specialization, qualification, phone, email, available_days, available_time, channeling_fee, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctorRes = await db.query('SELECT user_id FROM doctors WHERE doctor_id = $1', [id]);
    if (doctorRes.rows.length > 0) {
      const userId = doctorRes.rows[0].user_id;
      await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
    }
    res.json({ message: 'Doctor and associated user deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const searchDoctors = async (req, res) => {
  const { specialization } = req.query;
  try {
    const query = `
      SELECT d.*, dept.department_name 
      FROM doctors d 
      LEFT JOIN departments dept ON d.department_id = dept.department_id 
      WHERE d.specialization ILIKE $1 OR dept.department_name ILIKE $1
      ORDER BY d.full_name ASC
    `;
    const result = await db.query(query, [`%${specialization}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getDoctors, getDoctorById, addDoctor, updateDoctor, deleteDoctor, searchDoctors };
