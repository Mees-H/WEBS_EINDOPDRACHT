const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const { authenticateToken } = require('../common-modules/authenticateToken');
const { createShot, updateShot, deleteShot } = require('../controllers/shotController');

// Create, read, update, and delete a target
router.post('/', authenticateToken, upload.single('image'), createShot);
router.put('/:id', authenticateToken, updateShot);
router.delete('/:id', authenticateToken, deleteShot);

module.exports = router;