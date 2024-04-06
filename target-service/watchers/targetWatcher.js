const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const Target = require('../models/target');

async function checkShotForDeletion(message) {
    const { shot, userId } = JSON.parse(message);
    console.log(shot); 
    console.log(userId); 
}


function start() {
    setInterval(() => {
        consumeMessageFromQueue('shotDeleteCheck', checkShotForDeletion);
        console.log('Consuming messages from the queue:', queueNames.shotDeleteCheck);
    }, 10000);
}

module.exports = { start };