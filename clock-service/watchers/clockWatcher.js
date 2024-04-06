const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const Target = require('../models/target');

async function targetInDb(message) {
    try {
        const targetData = JSON.parse(message);

        const newTarget = new Target({
            _id: targetData._id,
            latitude: targetData.latitude,
            longitude: targetData.longitude,
            location: targetData.location,
            locationDescription: targetData.locationDescription,
            deadline: new Date(targetData.deadline),
            status: targetData.status,
            imageUrl: targetData.imageUrl,
            ownerId: targetData.ownerId,
        });

        // Save the new target to the database
        const savedTarget = await newTarget.save();

        console.log('Target saved successfully:', savedTarget);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

async function checkForExpiredTargets() {
    try {
        const expiredTargets = await Target.find({ 
            deadline: { $lt: new Date() },
            status: { $ne: 'Expired' }
        });
        console.log('Expired targets:', expiredTargets);

        for (const target of expiredTargets) {
            target.status = 'Expired';
            await target.save();
            sendMessageToQueue(queueNames.targetExpired, target.toObject());
            sendMessageToQueue(queueNames.getScoresMail, target.toObject());
        }
        
    } catch (error) {
        console.error('Error checking for expired targets:', error);
    }
}

function start() {
    setInterval(() => {
        consumeMessageFromQueue('targetCreateClock', targetInDb);
        console.log('Consuming messages from the queue:', queueNames.targetCreateClock);
        checkForExpiredTargets();
        console.log('Checking for expired targets...');
    }, 10000);
}

module.exports = { start };