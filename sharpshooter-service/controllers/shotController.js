const Shot = require('../models/shot');
const queueOptions = require('../common-modules/messageQueueNames');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const imageService = require('../common-modules/imageService');

async function createShot(req, res) {
    try {
        const shot = new Shot(req.body);
        // If there's an image in the request, upload it to Imgur
        if (req.file) {
            const imageUrl = await imageService.uploadImage(req.file.path, req.file.originalname);
            shot.imageUrl = imageUrl;
        } else {
            throw new Error('Image is required');
        }
        
        await shot.validate();
        await shot.save();

        sendMessageToQueue(queueOptions.shotCreate, shot.toObject());

        res.status(201).json({target: shot, message: 'Successfully created shot' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getShot(req, res) {
    try {
        const shot = await Shot.findById(req.params.id);
        res.status(200).json({ target: shot, message: 'Successfully retrieved shot' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateShot(req, res) {
    try {
        const shot = new Shot(req.body);
        await shot.validate();
        await Shot.findByIdAndUpdate(req.params.id, req.body);

        sendMessageToQueue(queueOptions.shotUpdate, shot.toObject());

        res.status(200).json({ target: shot, message: 'Successfully updated shot' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteShot(req, res) {
    try {
        const shot = await Shot.findByIdAndDelete(req.params.id);
        sendMessageToQueue(queueOptions.shotDelete, shot.toObject());
        res.status(200).json({ target: shot, message: 'Successfully deleted shot' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getShots(req, res) {
    try {
        const shots = await Shot.find({});
        res.status(200).json({targets: shots,  message: 'Successfully retrieved shots' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createShot,
    getShot,
    updateShot,
    deleteShot,
    getShots
};