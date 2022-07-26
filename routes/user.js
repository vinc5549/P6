const express = require('express');
const router = express.Router();
const userCrtl = require('../controllers/user');
const createAccountLimiter = require('../middleware/rate-limit');
const checkEmail = require('../middleware/email-validator');
const checkPassword = require('../middleware/password-validator');

//router.post('/signup',createAccountLimiter, userCrtl.signup);
//router.post('/login', userCrtl.login);

router.post('/signup',checkPassword, checkEmail, userCrtl.signup);
router.post('/login', createAccountLimiter, userCrtl.login);

module.exports = router;