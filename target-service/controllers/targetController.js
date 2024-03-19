const Target = require('../models/target');
const queueOptions = require('../config/queueOptions');
const sendMessageToQueue = require('../services/rabbitMQService');

async function createTarget(req, res) {
    try {
        const target = new Target(req.body);
        await target.validate();
        await target.save();

        sendMessageToQueue(queueOptions.targetCreate, target.toObject());

        res.status(201).json({target, message: 'Successfully created target' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getTarget(req, res) {
    try {
        const target = await Target.findById(req.params.id);
        res.status(200).json({ target, message: 'Successfully retrieved target' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateTarget(req, res) {
    try {
        const target = new Target(req.body);
        await target.validate();
        await Target.findByIdAndUpdate(req.params.id, req.body);

        sendMessageToQueue(queueOptions.targetUpdate, target.toObject());

        res.status(200).json({ target, message: 'Successfully updated target' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteTarget(req, res) {
    try {
        const target = await Target.findByIdAndDelete(req.params.id);
        sendMessageToQueue(queueOptions.targetDelete, target.toObject());
        res.status(200).json({ target, message: 'Successfully deleted target' });
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
    createTarget,
    getTarget,
    updateTarget,
    deleteTarget,
    getTargets,
};