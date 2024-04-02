const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const { authenticateToken } = require('../common-modules/authenticateToken');
const { createTarget, getTarget, updateTarget, deleteTarget, getTargets } = require('../controllers/targetController');

// Create, read, update, and delete a target
router.post('/', authenticateToken, upload.single('image'), createTarget);
router.get('/:id', authenticateToken, getTarget);
router.put('/:id', authenticateToken, updateTarget);
router.delete('/:id', authenticateToken, deleteTarget);

// List all targets
router.get('/', authenticateToken, getTargets);

module.exports = router;