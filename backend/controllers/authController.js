const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, email, hashedPassword, role]
    );

    const user = newUser.rows[0];

    // If patient, create patient profile
    if (role === 'Patient') {
      await db.query(
        'INSERT INTO patients (user_id, full_name) VALUES ($1, $2)',
        [user.user_id, full_name]
      );
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Get profile ID (patient_id or doctor_id)
    let profileId = null;
    if (user.role === 'Patient') {
      const patientRes = await db.query('SELECT patient_id FROM patients WHERE user_id = $1', [user.user_id]);
      profileId = patientRes.rows[0]?.patient_id;
    } else if (user.role === 'Doctor') {
      const doctorRes = await db.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [user.user_id]);
      profileId = doctorRes.rows[0]?.doctor_id;
    }

    const payload = {
      user_id: user.user_id,
      role: user.role,
      profile_id: profileId,
      full_name: user.full_name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.user_id, name: user.full_name, email: user.email, role: user.role, profile_id: profileId } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getProfile = async (req, res) => {
  try {
    const userRes = await db.query('SELECT user_id, full_name, email, role FROM users WHERE user_id = $1', [req.user.user_id]);
    res.json(userRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { register, login, getProfile };
