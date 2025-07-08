const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.put('/password', auth(['user', 'owner']), userController.updatePassword);

module.exports = router;
