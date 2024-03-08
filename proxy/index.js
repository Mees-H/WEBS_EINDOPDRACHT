const express = require('express')
const {ROUTES} = require("./routes");
const {setupLogging} = require("./logging");
const {setupProxies} = require("./proxy");

const app = express()
const port = 3000;

setupLogging(app);
setupProxies(app, ROUTES);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})