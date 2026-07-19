const db = require('../config/db');

const getDepartments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.*, fn_get_dept_doctor_count(d.department_id) as doctor_count
      FROM departments d
      ORDER BY d.department_id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const addDepartment = async (req, res) => {
  const { department_name, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO departments (department_name, description) VALUES ($1, $2) RETURNING *',
      [department_name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { department_name, description } = req.body;
  try {
    const result = await db.query(
      'UPDATE departments SET department_name = $1, description = $2 WHERE department_id = $3 RETURNING *',
      [department_name, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM departments WHERE department_id = $1', [id]);
    res.json({ message: 'Department deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getDepartments, addDepartment, updateDepartment, deleteDepartment };
