const express = require('express')
const bodyParser = require('body-parser');
const targetRoutes = require('./routes/targetRoutes');
const targetWatcher = require('./watchers/targetWatcher');

// Watcher
targetWatcher.start();

// Express
const app = express()
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use('/targets', targetRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
