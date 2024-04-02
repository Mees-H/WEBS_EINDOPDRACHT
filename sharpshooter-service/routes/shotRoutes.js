const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const { createShot, getShot, updateShot, deleteShot, getShots } = require('../controllers/shotController');

// Create, read, update, and delete a target
router.post('/', upload.single('image'), createShot);
router.get('/:id', getShot);
router.put('/:id', updateShot);
router.delete('/:id', deleteShot);

// List all targets
router.get('/', getShots);

module.exports = router;