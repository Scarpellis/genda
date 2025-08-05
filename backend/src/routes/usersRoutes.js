const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/usersController');

router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;
