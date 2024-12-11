const express = require('express');
const authController = require('../controllers/AuthController')
const router = express.Router();

router.post('/signup', authController.signup);

router.get("google", authController.googleAuth);
router.get("/check", authController.getUserProfile);

router.get("/google/callback", authController.googleAuthCallback);
module.exports = router;
