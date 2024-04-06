const Target = require('../models/target');
const queueOptions = require('../common-modules/messageQueueNames');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const imageService = require('../common-modules/imageService');

async function createTarget(req, res) {
    try {
        const targetData = req.body;
        const target = new Target({
            ...targetData,
            location: {
                type: 'Point',
                coordinates: [targetData.longitude, targetData.latitude]
            }
        });
        // If there's an image in the request, upload it to Imgur
        if (req.file) {
            const imageUrl = await imageService.uploadImage(req.file.path, req.file.originalname);
            target.imageUrl = imageUrl;
        } else {
            throw new Error('Image is required');
        }

        console.log(req.user);

        target.ownerId = req.user.userId;

        await target.validate();
        await target.save();

        // send message to both mailservice (targetCreate) and score service (targetCreateScore)
        sendMessageToQueue(queueOptions.targetCreate, target.toObject());
        sendMessageToQueue(queueOptions.targetCreateScore, target.toObject());

        res.status(201).json({ target, message: 'Successfully created target' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateTarget(req, res) {
    try {
        const target = new Target(req.body);
        await target.validate();
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.longitude, req.body.latitude]
        };
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
        const target = await Target.findById(req.params.id);
        // if it is your target, you can delete it
        if (target.ownerId !== req.user.userId) {
            throw new Error('You can only delete your own targets');
        }
        await Target.findByIdAndDelete(req.params.id);
        sendMessageToQueue(queueOptions.targetDelete, target.toObject());
        res.status(200).json({ target, message: 'Successfully deleted target' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createTarget,
    updateTarget,
    deleteTarget,
};