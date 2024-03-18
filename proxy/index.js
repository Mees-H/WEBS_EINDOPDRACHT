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
    console.error(err);
    res.status(500).send('Internal Server Error');
}

app.use(circuitBreaker({
    proxy: `http://localhost:${port}`,
    options: options,
    catchError: catchError 
}));

// Targets GET, PUT, DELETE
app.use('/targets/:id', proxy('http://localhost:3001', {
    proxyReqPathResolver: function(req) {
        return '/targets/' + req.params.id; 
    }
}));

// Targets POST
app.use('/targets', proxy('http://localhost:3001', {
    proxyReqPathResolver: function(req) {
        return '/targets';
    }
}));

// Sharpshooters GET, PUT, DELETE
app.use('/sharpshooters/:id', proxy('http://localhost:3001', {
    proxyReqPathResolver: function(req) {
        return '/sharpshooters/' + req.params.id; 
    }
}));

// Sharpshooters POST
app.use('/sharpshooters', proxy('http://localhost:3001', {
    proxyReqPathResolver: function(req) {
        return '/sharpshooters';
    }
}));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
