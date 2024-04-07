const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const Target = require('../models/target');
const Shot = require('../models/shot');
const { compareImages } = require('../common-modules/scoreService');

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

async function calculateScore() {
    try {
        // Get all targets from the database
        const targets = await Target.find();
        let shots = [];

        for (let target of targets) {
            // Get all shots from the database where the targetId of the shot matches the id of the target
            // and the shot does not have a score yet
            const targetShots = await Shot.find({ targetId: target._id, score: null });
            shots = shots.concat(targetShots);
        }
       
        console.log("Shots:", shots);
        // Calculate the scores with the scoreService
        for (let shot of shots) {
            const target = targets.find(t => t._id.toString() === shot.targetId.toString());
            if (!target) {
                console.log('No target found for shot', shot._id);
                continue;
            }
            // TURN THIS BACK ON LATERR
            // const scoreResult = await compareImages(target.imageUrl, shot.imageUrl);
            // const score = scoreResult.result.distance;

            const score = Math.floor(Math.random() * 100) + 1;
            console.log('Score:', score);
            // Create a new message with the shotId and the calculated score
            const message = { shotId: shot._id, score: score };
            await scoreInDb(JSON.stringify(message));
            console.log('Score saved successfully:', score);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

async function scoreInDb(message) {
    try {
        const scoreData = JSON.parse(message);

        // Find the shot in the database using the shotId from the message
        const shot = await Shot.findById(scoreData.shotId);

        // Update the score of the shot
        shot.score = scoreData.score;

        // Save the updated shot to the database
        const updatedShot = await shot.save();

        console.log('Score updated successfully:', updatedShot);

        sendMessageToQueue(queueNames.shotScoreUpdate, updatedShot.toObject());
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

async function getScoresMail(message) {
    try {
        const target = JSON.parse(message);

        console.log('Target:', target);
        // Find all shots for the target in the database
        const shots = await Shot.find({ targetId: target._id });

        sendMessageToQueue(queueNames.getMailForScores, {shots: shots, target: target});
        
        console.log('Scores mail sent successfully:', shots);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

function start() {
    setInterval(() => {
        consumeMessageFromQueue('targetCreateScore', targetInDb);
        consumeMessageFromQueue('shotCreateScore', shotInDb);
        consumeMessageFromQueue('getScoresMail', getScoresMail);
        calculateScore();
        console.log('Consuming messages from the queue:', queueNames.targetCreateScore, queueNames.shotCreateScore);
    }, 10000);
}

module.exports = { start };