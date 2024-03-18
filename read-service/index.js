const amqp = require('amqplib/callback_api');

// RabbitMQ connection URL
const rabbitMQurl = 'amqp://localhost';

function createChannels(connection, queueName) {
  connection.createChannel(function(error, channel) {
    if (error) {
      throw error;
    }

    channel.assertQueue(queueName, {
      durable: false
    });

    channel.consume(queueName, function(msg) {
      console.log(queueName + ': ' + msg.content.toString());
    }, {
      noAck: true
    });
  });
}

// Connect to RabbitMQ
amqp.connect(rabbitMQurl, function(error, connection) {
  if (error) {
    throw error;
  }
  createChannels(connection, 'targetCreate');
  createChannels(connection, 'targetUpdate');
  createChannels(connection, 'targetDelete');
});
