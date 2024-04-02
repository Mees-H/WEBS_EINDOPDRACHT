const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const targetController = require('../controllers/targetController');

// Create, read, update, and delete a target
router.post('/', upload.single('image'), targetController.createTarget);
router.get('/:id', targetController.getTarget);
router.put('/:id', targetController.updateTarget);
router.delete('/:id', targetController.deleteTarget);

// List all targets
router.get('/', targetController.getTargets);

module.exports = router;