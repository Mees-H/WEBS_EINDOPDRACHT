const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../common-modules/authenticateToken');
const { getTarget, getTargets } = require('../controllers/targetController');

router.get('/:id', authenticateToken, getTarget);

// List all targets
router.get('/', authenticateToken, getTargets);

// // Get scores for all participants on a specific target
// router.get('/:id/scores', authenticateToken, getScoresForTarget);

// // Get targets based on location name or coordinates
// router.get('/search', authenticateToken, getTargetsByLocation);

// // Get a specific participant's score on a specific target
// router.get('/:id/scores/:participantId', authenticateToken, getParticipantScoreForTarget);

module.exports = router;