const express = require('express')
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

// Express
const app = express()
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})