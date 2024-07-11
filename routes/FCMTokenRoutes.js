const express = require('express');
const router = express.Router();
const fcmController = require('../controllers/FCMTokenController');

// Rota para armazenar o FCM Token
router.post('/store', fcmController.storeFCMToken);

// Rota para obter todos os FCM Tokens
router.get('/all', fcmController.getAllFCMTokens);

module.exports = router;
