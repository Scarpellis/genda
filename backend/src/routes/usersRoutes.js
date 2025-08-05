const express = require('express');
const router = express.Router();
const { createUser, listUsers } = require('../controllers/usersController');

router.post('/', createUser);
router.get('/', listUsers);

module.exports = router;
