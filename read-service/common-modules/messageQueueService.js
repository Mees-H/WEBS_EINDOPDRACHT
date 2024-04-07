const amqp = require('amqplib/callback_api');
const rabbitMQurl = process.env.RABBITMQ_URL || 'amqp://localhost';
let rabbitMQChannel;

// Function to connect to RabbitMQ
function connectToRabbitMQ() {
    amqp.connect(rabbitMQurl, function(error0, connection) {
        if (error0) {
            console.error('Failed to connect to RabbitMQ, retrying in 5 seconds', error0);
            return setTimeout(connectToRabbitMQ, 5000);
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.error('Failed to create channel', error1);
                return setTimeout(connectToRabbitMQ, 5000);
            }
            rabbitMQChannel = channel;
            console.log('Connected to RabbitMQ at ', rabbitMQurl);
        });
    });
}

function sendMessageToQueue(queueName, message) {
    if (!rabbitMQChannel) {
        connectToRabbitMQ();
    }
    if (rabbitMQChannel) {
        rabbitMQChannel.assertQueue(queueName, { durable: false });
        rabbitMQChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    } else {
        throw new Error("RabbitMQ channel doesn't exist");
    }
}

function consumeMessageFromQueue(queueName, callback) {
    if (!rabbitMQChannel) {
        connectToRabbitMQ();
    }
    if (rabbitMQChannel) {
        rabbitMQChannel.assertQueue(queueName, { durable: false });
        rabbitMQChannel.consume(queueName, function(msg) {
            console.log("Received message:", msg.content.toString());
            var isfinished = callback(msg.content.toString());
            if (isfinished)
                rabbitMQChannel.ack(msg);
        }, { noAck: false });
    } else {
        console.log("RabbitMQ channel doesn't exist");
    }
}

module.exports = {
    sendMessageToQueue,
    consumeMessageFromQueue
};
