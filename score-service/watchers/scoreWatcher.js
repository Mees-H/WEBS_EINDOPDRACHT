const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const Target = require('../models/target');
const Shot = require('../models/shot');

// This callback function will process messages received from the queue.
async function targetInDb(message) {
    try {
        const targetData = JSON.parse(message);

        const newTarget = new Target({
            latitude: targetData.latitude,
            longitude: targetData.longitude,
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

async function shotInDb(message) {
    try {
        const shotData = JSON.parse(message);

        const newShot = new Shot({
            targetId: shotData.targetId,
            status: shotData.status,
            imageUrl: shotData.imageUrl,
            shooterId: shotData.shooterId,
        });

        // Save the new shot to the database
        const savedShot = await newShot.save();
        console.log('Shot saved successfully:', savedShot);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

function start() {
    setInterval(() => {
        consumeMessageFromQueue('targetCreateScore', targetInDb);
        consumeMessageFromQueue('shotCreateScore', shotInDb);
        console.log('Consuming messages from the queue:', queueNames.targetCreateScore, queueNames.shotCreateScore);
    }, 10000);
}

module.exports = { start };