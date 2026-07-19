const express = require('express');
const router = express.Router();
const { getDepartments, addDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getDepartments);
router.post('/', authMiddleware, roleMiddleware(['Admin']), addDepartment);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updateDepartment);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteDepartment);

module.exports = router;
