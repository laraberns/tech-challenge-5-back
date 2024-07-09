const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.get('/alltasks', tasksController.getTasks);
router.get('/:id', tasksController.getTaskById);
router.post('/addtask', tasksController.addTask);
router.patch('/changetask', tasksController.changeTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
