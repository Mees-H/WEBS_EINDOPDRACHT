const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../common-modules/authenticateToken');
const { getShot, getShots } = require('../controllers/shotController');

router.get('/:id', authenticateToken, getShot);

// List all shots
router.get('/', authenticateToken, getShots);

module.exports = router;