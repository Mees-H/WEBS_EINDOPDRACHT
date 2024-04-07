const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const User = require('../models/user');

async function getMailForScores(message) {
    // loop through all shots, get the mail of the shooter where the shooterId matches the id of the user
    const { shots: shotData } = JSON.parse(message);
    const { target: targetData } = JSON.parse(message);
    var emails = [];
    var ownerEmail = '';
    console.log('Shot data:', shotData);
    console.log("target data: ", targetData);
    // Check if shotData exists and is an array
    if (shotData && Array.isArray(shotData)) {
        for (let shot of shotData) {
            try {
                const user = await User.findById(shot.shooterId);
                //get the email of the user and add it to the list of emails
                console.log('User found:', user);
                emails.push(user.email);
            } catch (err) {
                console.error('Error finding user:', err);
            }
        }
    } else {
        console.error('shotData is not iterable');
    }
    //get the email of the owner of the target
    try {
        const owner = await User.findById(targetData.ownerId);
        ownerEmail = owner.email;
    } catch (err) {
        console.error('Error finding owner:', err);
    }
    //send the emails and the shots to the mail service
    sendMessageToQueue(queueNames.sendScoresMail, { emails, ownerEmail, shots: shotData, target: targetData});
}

function start() {
    setInterval(() => {
        consumeMessageFromQueue('getMailForScores', getMailForScores);
        console.log('Consuming messages from the queue:', queueNames.getMailForScores);
    }, 10000);
}

module.exports = { start };