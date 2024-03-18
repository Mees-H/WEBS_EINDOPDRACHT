const express = require('express');
const proxy = require('express-http-proxy');
const circuitBreaker = require('express-circuit-breaker');

const app = express();
const port = 3000;

const options = {
    timeout: 10000,
    errorThreshold: 50,
    resetTimeout: 30000
};

function catchError(err, req, res, next) {
    // Handle errors here, you can log them or send an appropriate response
    console.error(err);
    res.status(500).send('Internal Server Error');
}

app.use(circuitBreaker({
    proxy: `http://localhost:${port}`,
    options: options,
    catchError: catchError // Provide catchError function here
}));

app.use('/targets/:id', proxy('http://localhost:3001'));

app.use('/sharpshooters/*', proxy('http://localhost:3002'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
