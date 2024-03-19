const express = require('express')
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const targetRoutes = require('./routes/targetRoutes');

// Express
const app = express()
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use('', targetRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})