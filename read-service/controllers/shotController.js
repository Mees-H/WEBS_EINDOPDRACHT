
const Shot = require('../models/shot');

async function getShot(req, res) {
    try {
        const shot = await Shot.findById(req.params.id);
        res.status(200).json({ shot: shot, message: 'Successfully retrieved shot' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getShots(req, res) {
    try {
        const shots = await Shot.find({});
        res.status(200).json({shots: shots,  message: 'Successfully retrieved shots' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getShot,
    getShots,
};