const express = require('express')
const bodyParser = require('body-parser');
const shotRoutes = require('./routes/shotRoutes');

// Express
const app = express()
const port = process.env.PORT || 3002;

app.use(bodyParser.json());

app.use('/shots', shotRoutes);

app.listen(port, () => {
    console.log(`Sharpshooter service listening at http://localhost:${port}`)
})