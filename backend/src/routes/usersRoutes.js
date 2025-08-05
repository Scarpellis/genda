const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', createUser);
router.get('/', authMiddleware, getUsers);

module.exports = router;
