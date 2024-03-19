
const rabbitMQChannel = require('../config/rabbitMQ');

function sendMessageToQueue(queueName, message) {
    if (rabbitMQChannel) {
        rabbitMQChannel.assertQueue(queueName, { durable: false });
        rabbitMQChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    } else {
        throw new Error("RabbitMQ channel doesn't exist");
    }
}

module.exports = sendMessageToQueue;