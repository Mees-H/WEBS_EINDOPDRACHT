const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const User = require('../models/user');

async function getMailForScores(message) {
    // loop through all shots, get the mail of the shooter where the shooterId matches the id of the user
    const shotData = JSON.parse(message);
    var emails = [];
    console.log('Shot data:', shotData);
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
    //send the emails and the shots to the mail service
    sendMessageToQueue(queueNames.sendScoresMail, { emails, shots: shotData });
}

function start() {
    setInterval(() => {
        consumeMessageFromQueue('getMailForScores', getMailForScores);
        console.log('Consuming messages from the queue:', queueNames.getMailForScores);
    }, 10000);
}

module.exports = { start };