const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/usersController');

router.post('/', createUser);

module.exports = router;
