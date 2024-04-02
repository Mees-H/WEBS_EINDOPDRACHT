const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const { createTarget, getTarget, updateTarget, deleteTarget, getTargets } = require('../controllers/targetController');

// Create, read, update, and delete a target
router.post('/', upload.single('image'), createTarget);
router.get('/:id', getTarget);
router.put('/:id', updateTarget);
router.delete('/:id', deleteTarget);

// List all targets
router.get('/', getTargets);

module.exports = router;