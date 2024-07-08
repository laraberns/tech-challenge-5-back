const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/usersControllers');

router.get('/allusers', usersControllers.getUsers);
router.get('/:id', usersControllers.getUserById);
router.post('/adduser', usersControllers.addUser);
router.patch('/changeuser', usersControllers.changeUser);
router.delete('/:id', usersControllers.deleteUser);

module.exports = router;
