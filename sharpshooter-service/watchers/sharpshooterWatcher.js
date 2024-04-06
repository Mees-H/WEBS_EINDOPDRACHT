const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const queueNames = require('../common-modules/messageQueueNames');
const Shot = require('../models/shot');

async function ProceedDeletion(message) {
    const data = JSON.parse(message);
    const shotId = data._id;
    console.log(shotId);
    if (shotId) {
        await Shot.findByIdAndDelete(shotId);
    } else {
        console.error('shotId is undefined');
    }
}

async function CancelDeletion(message) {
    const data = JSON.parse(message);
    const shotId = data._id;
    console.log(shotId);
    if (shotId) {
        await Shot.findByIdAndUpdate(shotId, { status: 'Pending' });
    } else {
        console.error('shotId is undefined');
    }
}


function start() {
    setInterval(() => {
        consumeMessageFromQueue('shotDeleteProceed', ProceedDeletion);
        consumeMessageFromQueue('shotDeleteCancel', CancelDeletion);
        console.log('Consuming messages from the queue:', queueNames.shotDeleteProceed, queueNames.shotDeleteCancel);
    }, 10000);
}

module.exports = { start };