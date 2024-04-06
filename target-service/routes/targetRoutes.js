const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const { authenticateToken } = require('../common-modules/authenticateToken');
const { createTarget, updateTarget, deleteTarget } = require('../controllers/targetController');

// Create, update, and delete a target
router.post('/', authenticateToken, upload.single('image'), createTarget);
router.put('/:id', authenticateToken, updateTarget);
router.delete('/:id', authenticateToken, deleteTarget);

module.exports = router;