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

        shot.shooterId = req.user.userId;
        
        await shot.validate();
        await shot.save();

        sendMessageToQueue(queueOptions.shotCreate, shot.toObject());
        sendMessageToQueue(queueOptions.shotCreateScore, shot.toObject());

        res.status(201).json({shot: shot, message: 'Successfully created shot' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateShot(req, res) {
    try {
        const shot = new Shot(req.body);
        await shot.validate();
        await Shot.findByIdAndUpdate(req.params.id, req.body);

        sendMessageToQueue(queueOptions.shotUpdate, shot.toObject());

        res.status(200).json({ shot: shot, message: 'Successfully updated shot' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteShot(req, res) {
    try {
        const shot = await Shot.findById(req.params.id);

        if (!shot) {
            res.status(404).json({ message: 'Shot not found' });
            return;
        }
        
        if (shot.shooterId == req.user.userId) {
            await Shot.findByIdAndDelete(req.params.id);
            sendMessageToQueue(queueOptions.shotDelete, shot.toObject());
            res.status(200).json({ shot: shot, message: 'Successfully deleted shot' });
        }

        else {
            shot.status = 'Pending_deletion';
            await shot.save();
            sendMessageToQueue(queueOptions.shotDeleteCheck, { shot: shot.toObject(), userId: req.user.userId });
            res.status(202).json({ shot: shot, message: 'Shot is pending deletion' });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createShot,
    updateShot,
    deleteShot,
};