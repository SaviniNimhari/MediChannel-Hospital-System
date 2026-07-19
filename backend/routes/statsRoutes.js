const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/public-stats', async (req, res) => {
  try {
    const doctorCount = await db.query('SELECT COUNT(*) FROM doctors');
    const patientCount = await db.query('SELECT COUNT(*) FROM patients');
    const deptCount = await db.query('SELECT COUNT(*) FROM departments');
    
    // We'll also calculate "Years of Experience" based on the earliest doctor or a default
    res.json({
      specialists: doctorCount.rows[0].count,
      patients: patientCount.rows[0].count,
      departments: deptCount.rows[0].count,
      experience: 12 // Hardcoded or calculated
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
