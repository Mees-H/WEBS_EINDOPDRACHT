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
            console.log('Connected to RabbitMQ');
        });
    });
}

// Call the function to establish the connection
connectToRabbitMQ();

module.exports = rabbitMQChannel;