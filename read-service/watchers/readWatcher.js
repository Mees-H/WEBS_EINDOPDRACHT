const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const Target = require('../models/target');
const Shot = require('../models/shot');

// This callback function will process messages received from the queue.
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

async function targetUpDb(message) {
    try {
        const targetData = JSON.parse(message);

        const updatedTarget = {
            latitude: targetData.latitude,
            longitude: targetData.longitude,
            locationDescription: targetData.locationDescription,
            deadline: new Date(targetData.deadline),
            status: targetData.status,
            imageUrl: targetData.imageUrl,
            ownerId: targetData.ownerId,
        };

        // Update the target in the database
        const result = await Target.findByIdAndUpdate(targetData._id, updatedTarget);

        console.log('Target updated successfully:', result);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

async function targetDelDb(message) {
    try {
        const targetData = JSON.parse(message);

        // Delete the target from the database
        const result = await Target.findByIdAndDelete(targetData._id);

        console.log('Target deleted successfully:', result);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

async function shotInDb(message) {
    try {
        const shotData = JSON.parse(message);

        const newShot = new Shot({
            _id: shotData._id,
            targetId: shotData.targetId,
            status: shotData.status,
            imageUrl: shotData.imageUrl,
            shooterId: shotData.shooterId,
            score: shotData.score,
        });

        // Save the new shot to the database
        const savedShot = await newShot.save();
        console.log('Shot saved successfully:', savedShot);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

async function shotUpDb(message) {
    try {
        const shotData = JSON.parse(message);

        const updatedShot = {
            targetId: shotData.targetId,
            status: shotData.status,
            imageUrl: shotData.imageUrl,
            shooterId: shotData.shooterId,
            score: shotData.score,
        };

        // Update the shot in the database
        const result = await Shot.findByIdAndUpdate(shotData._id, updatedShot);

        console.log('Shot updated successfully:', result);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

async function shotDelDb(message) {
    try {
        const shotData = JSON.parse(message);

        // Delete the shot from the database
        const result = await Shot.findByIdAndDelete(shotData._id);

        console.log('Shot deleted successfully:', result);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

async function shotScoreUpDb(message) {
    try {
        const shotData = JSON.parse(message);

        // Check if the shot exists in the database
        const shot = await Shot.findById(shotData._id);

        if (shot) {
            // If the shot exists, update its score
            shot.score = shotData.score;
            const result = await shot.save();
            console.log('Shot score updated successfully:', result);
        } else {
            console.log('No shot found with id:', shotData._id);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
}


function start() {
    setInterval(() => {
        consumeMessageFromQueue('targetCreate', targetInDb);
        consumeMessageFromQueue('targetUpdate', targetUpDb);
        consumeMessageFromQueue('targetDelete', targetDelDb);
        consumeMessageFromQueue('shotCreate', shotInDb);
        consumeMessageFromQueue('shotUpdate', shotUpDb);
        consumeMessageFromQueue('shotDelete', shotDelDb);
        consumeMessageFromQueue('shotScoreUpdate', shotScoreUpDb);
        console.log('Consuming messages from the queue:', queueNames.targetCreate, queueNames.targetUpdate, queueNames.targetDelete, queueNames.shotCreate, queueNames.shotUpdate, queueNames.shotDelete, queueNames.shotScoreUpdate);
    }, 10000);
}

module.exports = { start };