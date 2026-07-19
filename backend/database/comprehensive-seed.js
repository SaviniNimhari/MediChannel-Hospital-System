const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const seed = async () => {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log('🚀 Starting comprehensive seeding...');

    // 1. Clear existing dynamic data
    await pool.query('DELETE FROM payments');
    await pool.query('DELETE FROM appointments');
    await pool.query('DELETE FROM doctors');
    await pool.query('DELETE FROM patients');
    await pool.query('DELETE FROM users WHERE role != \'Admin\'');
    console.log('🧹 Cleaned up old sample data.');

    // 2. Get Department IDs
    const depts = await pool.query('SELECT department_id, department_name FROM departments');
    const deptMap = {};
    depts.rows.forEach(d => deptMap[d.department_name] = d.department_id);

    // 3. Seed Doctors
    const doctorsData = [
      { name: 'Alexander Pierce', email: 'pierce@medichannel.com', dept: 'Cardiology', spec: 'Senior Cardiologist', fee: 50 },
      { name: 'Sarah Jenkins', email: 'jenkins@medichannel.com', dept: 'Neurology', spec: 'Neurosurgeon', fee: 75 },
      { name: 'Michael Chen', email: 'chen@medichannel.com', dept: 'Pediatrics', spec: 'Pediatric Specialist', fee: 40 },
      { name: 'Emily Watson', email: 'watson@medichannel.com', dept: 'Orthopedics', spec: 'Orthopedic Surgeon', fee: 60 }
    ];

    const doctorIds = [];
    for (const d of doctorsData) {
      const userRes = await pool.query(
        'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id',
        [d.name, d.email, hashedPassword, 'Doctor']
      );
      const docRes = await pool.query(
        'INSERT INTO doctors (user_id, department_id, full_name, specialization, qualification, phone, email, available_days, available_time, channeling_fee) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING doctor_id',
        [userRes.rows[0].user_id, deptMap[d.dept], d.name, d.spec, 'MBBS, MD', '555-010', d.email, 'Mon, Wed, Fri', '08:00 AM - 12:00 PM', d.fee]
      );
      doctorIds.push(docRes.rows[0].doctor_id);
    }
    console.log('👨‍⚕️ Seeded 4 Doctors.');

    // 4. Seed Patients
    const patientsData = [
      { name: 'John Doe', email: 'john@gmail.com', age: 34, gender: 'Male', phone: '555-0201' },
      { name: 'Jane Smith', email: 'jane@gmail.com', age: 28, gender: 'Female', phone: '555-0202' }
    ];

    const patientIds = [];
    for (const p of patientsData) {
      const userRes = await pool.query(
        'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id',
        [p.name, p.email, hashedPassword, 'Patient']
      );
      const pRes = await pool.query(
        'INSERT INTO patients (user_id, full_name, age, gender, phone, address, medical_history) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING patient_id',
        [userRes.rows[0].user_id, p.name, p.age, p.gender, p.phone, '123 Health St', 'No major history']
      );
      patientIds.push(pRes.rows[0].patient_id);
    }
    console.log('👤 Seeded 2 Patients.');

    // 5. Seed Appointments & Payments
    const appointmentDates = ['2026-06-01', '2026-06-05', '2026-06-10'];
    for (let i = 0; i < 3; i++) {
      const pId = patientIds[i % 2];
      const dId = doctorIds[i % 4];
      
      const appRes = await pool.query(
        'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, appointment_status, reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING appointment_id',
        [pId, dId, appointmentDates[i], '10:00:00', 'Confirmed', 'Routine checkup']
      );
      
      await pool.query(
        'INSERT INTO payments (appointment_id, patient_id, amount, payment_method, payment_status) VALUES ($1, $2, $3, $4, $5)',
        [appRes.rows[0].appointment_id, pId, 50.00 + (i * 10), 'Card', 'Paid']
      );
    }
    console.log('📅 Seeded Appointments & Payments.');

    console.log('\n✅ Seeding Complete!');
    console.log('All Users password: password123');

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await pool.end();
  }
};

seed();
