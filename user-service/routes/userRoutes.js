const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const { register, login } = require('../controllers/userController');

router.post('/register', upload.none(), register);
router.post('/login', upload.none(), login);

module.exports = router;