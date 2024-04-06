const express = require('express')
const bodyParser = require('body-parser');
const targetRoutes = require('./routes/targetRoutes');
const shotRoutes = require('./routes/shotRoutes');

const readWatcher = require('./watchers/readWatcher');

readWatcher.start();

// Express
const app = express()
const port = process.env.PORT || 3006;

app.use(bodyParser.json());

app.use('/targets', targetRoutes);

app.use('/shots', shotRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})