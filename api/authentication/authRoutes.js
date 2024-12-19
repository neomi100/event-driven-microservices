const express = require('express');
const { requireAuth } = require('../../middlewares/require.auth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { login, signup, logout } = require('./authController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', log, requireAuth, logout);

module.exports = router;