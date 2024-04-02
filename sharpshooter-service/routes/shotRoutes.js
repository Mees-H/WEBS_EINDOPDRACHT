const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const { authenticateToken } = require('../common-modules/authenticateToken');
const { createShot, getShot, updateShot, deleteShot, getShots } = require('../controllers/shotController');

// Create, read, update, and delete a target
router.post('/', authenticateToken, upload.single('image'), createShot);
router.get('/:id', authenticateToken, getShot);
router.put('/:id', authenticateToken, updateShot);
router.delete('/:id', authenticateToken, deleteShot);

// List all targets
router.get('/', authenticateToken, getShots);

module.exports = router;