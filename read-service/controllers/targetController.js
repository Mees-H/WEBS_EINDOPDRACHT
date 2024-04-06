
const Target = require('../models/target');
const Shot = require('../models/shot');

async function getTarget(req, res) {
    try {
        const target = await Target.findById(req.params.id);
        res.status(200).json({ target, message: 'Successfully retrieved target' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getTargets(req, res) {
    try {
        const targets = await Target.find({});
        res.status(200).json({targets,  message: 'Successfully retrieved targets' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getShotsForTarget(req, res) {
    try {
        const shots = await Shot.find({ targetId: req.params.id });
        res.status(200).json({ shots, message: 'Successfully retrieved shots for target' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getTargetsByLocation(req, res) {
    try {
        const { longitude, latitude, radius } = req.query;
        const targets = await Target.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: radius
                }
            }
        });
        res.status(200).json({ targets, message: 'Successfully retrieved targets by location' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getMyScoreForTarget(req, res) {
    try {
        const shot = await Shot.findOne({ targetId: req.params.id, userId: req.user.userId });

        if (!shot) {
            res.status(404).json({ message: 'You have not shot at this target yet' });
            return;
        }
        res.status(200).json({ score: shot.score, message: 'Successfully retrieved my score for target' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getTarget,
    getTargets,
    getShotsForTarget,
    getTargetsByLocation,
    getMyScoreForTarget
};
