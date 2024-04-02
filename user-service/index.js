const express = require('express')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

// Express
const app = express()
const port = process.env.PORT || 3003;

app.use(bodyParser.json());

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`User service listening at http://localhost:${port}`)
})