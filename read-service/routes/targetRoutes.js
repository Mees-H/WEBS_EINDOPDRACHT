const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../common-modules/authenticateToken');
const { getTarget, getTargets, getShotsForTarget, getTargetsByLocation, getMyScoreForTarget } = require('../controllers/targetController');


// List all targets based on longitude and latitude and radius
router.get('/search', authenticateToken, getTargetsByLocation);

router.get('/:id', authenticateToken, getTarget);

// List all targets
router.get('/', authenticateToken, getTargets);

// List all shots for a target
router.get('/:id/shots', authenticateToken, getShotsForTarget);

// Get the score for a target
router.get('/:id/my-score', authenticateToken, getMyScoreForTarget);


module.exports = router;