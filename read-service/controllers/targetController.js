
const Target = require('../models/target');

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

module.exports = {
    getTarget,
    getTargets,
};
