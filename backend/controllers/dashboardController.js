const db = require('../config/db');

const getAdminStats = async (req, res) => {
  try {
    const patientsCount = await db.query('SELECT COUNT(*) FROM patients');
    const doctorsCount = await db.query('SELECT COUNT(*) FROM doctors');
    const appointmentsCount = await db.query('SELECT COUNT(*) FROM appointments');
    const departmentsCount = await db.query('SELECT COUNT(*) FROM departments');
    const revenue = await db.query("SELECT SUM(amount) FROM payments WHERE payment_status = 'Paid'");
    
    const recentAppointments = await db.query(`
      SELECT a.*, p.full_name as patient_name, d.full_name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      ORDER BY a.created_at DESC LIMIT 5
    `);

    // --- NEW: Advanced PostgreSQL System Metrics & Trends ---
    const dbStats = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users_count,
        (SELECT COUNT(*) FROM patients) as patients_count,
        (SELECT COUNT(*) FROM doctors) as doctors_count,
        (SELECT COUNT(*) FROM appointments) as appointments_count,
        (SELECT COUNT(*) FROM payments) as payments_count,
        pg_size_pretty(pg_database_size(current_database())) as db_size,
        version() as pg_version,
        pg_postmaster_start_time() as uptime,
        (SELECT count(*) FROM pg_stat_activity) as active_connections
    `);

    const dailyRevenue = await db.query(`
      SELECT TO_CHAR(payment_date, 'Mon DD') as day, SUM(amount)::int as total
      FROM payments
      WHERE payment_date > CURRENT_DATE - INTERVAL '7 days'
      GROUP BY day, payment_date
      ORDER BY payment_date ASC
    `);

    const indexStats = await db.query(`
      SELECT indexname, tablename FROM pg_indexes 
      WHERE schemaname = 'public'
    `);

    // --- NEW: Deep Dive Data Analytics ---
    const deptPerformance = await db.query(`
      SELECT d.department_name, SUM(p.amount)::int as revenue
      FROM departments d
      JOIN doctors doc ON d.department_id = doc.department_id
      JOIN appointments a ON doc.doctor_id = a.doctor_id
      JOIN payments p ON a.appointment_id = p.appointment_id
      GROUP BY d.department_name
      ORDER BY revenue DESC
    `);

    const tableSizes = await db.query(`
      SELECT relname as table_name, 
             pg_size_pretty(pg_total_relation_size(relid)) as total_size,
             n_live_tup as row_count
      FROM pg_stat_user_tables
    `);

    const statusBreakdown = await db.query(`
      SELECT appointment_status, COUNT(*) as count 
      FROM appointments 
      GROUP BY appointment_status
    `);

    res.json({
      totalPatients: patientsCount.rows[0].count,
      totalDoctors: doctorsCount.rows[0].count,
      totalAppointments: appointmentsCount.rows[0].count,
      totalDepartments: departmentsCount.rows[0].count,
      totalRevenue: revenue.rows[0].sum || 0,
      recentAppointments: recentAppointments.rows,
      dbMetrics: dbStats.rows[0],
      revenueTrends: dailyRevenue.rows,
      indexes: indexStats.rows,
      deptPerformance: deptPerformance.rows,
      tableSizes: tableSizes.rows,
      statusBreakdown: statusBreakdown.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getDoctorStats = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const todayAppt = await db.query(
      "SELECT fn_get_doctor_appointment_count($1, $2) as count",
      [doctorId, today]
    );
    
    const upcomingAppt = await db.query(
      "SELECT COUNT(*) FROM appointments WHERE doctor_id = $1 AND appointment_date > $2 AND appointment_status IN ('Confirmed', 'Pending')",
      [doctorId, today]
    );
    
    const completedAppt = await db.query(
      "SELECT COUNT(*) FROM appointments WHERE doctor_id = $1 AND appointment_status = 'Completed'",
      [doctorId]
    );

    const revenue = await db.query(
      "SELECT SUM(d.channeling_fee) FROM appointments a JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.doctor_id = $1 AND a.appointment_status = 'Completed'",
      [doctorId]
    );

    const appointments = await db.query(`
      SELECT a.*, p.full_name as patient_name, p.phone as patient_phone, a.appointment_time
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      WHERE a.doctor_id = $1 AND a.appointment_status IN ('Confirmed', 'Pending')
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
      LIMIT 10
    `, [doctorId]);

    res.json({
      todayAppointments: todayAppt.rows[0].count,
      upcomingAppointments: upcomingAppt.rows[0].count,
      completedAppointments: completedAppt.rows[0].count,
      totalEarnings: revenue.rows[0].sum || 0,
      appointments: appointments.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getPatientStats = async (req, res) => {
  const { patientId } = req.params;
  try {
    const upcoming = await db.query(
      "SELECT COUNT(*) FROM appointments WHERE patient_id = $1 AND appointment_status IN ('Pending', 'Confirmed')",
      [patientId]
    );
    
    const history = await db.query(`
      SELECT a.*, d.full_name as doctor_name, dep.department_name, d.specialization, a.appointment_time
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN departments dep ON d.department_id = dep.department_id
      WHERE a.patient_id = $1 
      ORDER BY a.appointment_date DESC LIMIT 5
    `, [patientId]);

    const totalSpent = await db.query(
      "SELECT fn_get_patient_total_spent($1) as spent",
      [patientId]
    );

    res.json({
      upcomingCount: upcoming.rows[0].count,
      recentHistory: history.rows,
      totalSpent: totalSpent.rows[0].spent || 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getAdminStats, getDoctorStats, getPatientStats };
