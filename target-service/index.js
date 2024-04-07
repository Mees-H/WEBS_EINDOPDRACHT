const express = require('express')
const bodyParser = require('body-parser');
const promBundle = require('express-prom-bundle');
const targetRoutes = require('./routes/targetRoutes');
const targetWatcher = require('./watchers/targetWatcher');


const metricsMiddleware = promBundle({
    includePath: true,
    includeStatusCode: true,
    normalizePath: true,
    promClient: {
        collectDefaultMetrics: {}
    }

});

// Watcher
targetWatcher.start();

// Express
const app = express()
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use(metricsMiddleware);

app.use('/targets', targetRoutes);

app.use('/metrics', (req, res) => {
    res.json({
        targets: targetWatcher.getTargets()
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
