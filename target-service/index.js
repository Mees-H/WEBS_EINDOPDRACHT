const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');

// Express
const app = express()
const port = 3001;

//MongoDB + Mongoose
const mongoDBurl = "mongodb://localhost:27017/targets";
mongoose.connect(mongoDBurl);

const TargetSchema = new mongoose.Schema({ 
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  status: {
    type: String,
    required: false,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  }
});

const Target = mongoose.model('targets', TargetSchema);

//RabbitMQ
let rabbitMQChannel;
const rabbitMQurl = 'amqp://localhost'; 

function connectToRabbitMQ() {
  amqp.connect(rabbitMQurl, function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      rabbitMQChannel = channel;
    });
  });
}

connectToRabbitMQ();

function sendMessageToQueue(queueName, message) {
  if (rabbitMQChannel) {
    rabbitMQChannel.assertQueue(queueName, { durable: false });
    rabbitMQChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  } else {
    throw new Error("RabbitMQ channel doesn't exist");
  }
}

//Routes
app.use(bodyParser.json());

app.post('/targets', async (req, res) => {
  try {
    const target = new Target(req.body);
    await target.validate();
    await target.save();

    sendMessageToQueue('targetCreate', target.toObject());

    res.status(200).json({target: target, message: 'Successfully created target'});
  } catch (error) {
    res.status(500).send(error); 
  }
});

app.put('/targets/:id', async (req, res) => {
  try {
    const target = new Target(req.body);
    await target.validate();
    await Target.findByIdAndUpdate(req.params.id, req.body);
    
    sendMessageToQueue('targetUpdate', target.toObject());

    res.status(200).json({target: target, message: 'Successfully updated target'});
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/targets/:id', async (req, res) => {
  try {
    const target = await Target.findByIdAndDelete(req.params.id);

    sendMessageToQueue('targetDelete', target.toObject());
    
    res.send({target: target, message: 'Successfully deleted target'});
  } catch (error) {
    res.status(500).send(error);
  }
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})