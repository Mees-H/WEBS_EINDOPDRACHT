const express = require('express')
const {setupLogging} = require("./logging");

const app = express()
const port = 3000;

setupLogging(app);

app.get('/', (req, resp) => {
    return resp.send('HELLO WORLD!');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})