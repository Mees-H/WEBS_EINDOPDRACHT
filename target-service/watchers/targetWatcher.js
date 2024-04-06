const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const Target = require('../models/target');

async function checkShotForDeletion(message) {
    const { shot, userId } = JSON.parse(message);
    // check if the shottargetid matched the target id and the owner id the the id of the token
    const target = await Target.findById(shot.targetId);
    if (!target || target.ownerId != userId) {
        sendMessageToQueue(queueNames.shotDeleteCancel, shot);
    }
    else {
        sendMessageToQueue(queueNames.shotDeleteProceed, shot);
    }
}

async function setExpiredTarget(message) {
    const target = JSON.parse(message);
    const expiredTarget = await Target.findById(target._id);
    if (!expiredTarget) {
        console.log('Target not found:', target._id);
        return;
    }
    if (expiredTarget.status === 'Expired') {
        console.log('Target already expired:', target._id);
        return;
    }
    expiredTarget.status = 'Expired';
    await expiredTarget.save();
}


function start() {
    setInterval(() => {
        consumeMessageFromQueue('shotDeleteCheck', checkShotForDeletion);
        consumeMessageFromQueue('targetExpired', setExpiredTarget);
        console.log('Consuming messages from the queue:', queueNames.shotDeleteCheck);
    }, 10000);
}

module.exports = { start };