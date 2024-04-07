const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) return res.sendStatus(401).json({error: 'No token provided'});

    jwt.verify(token, process.env.JWT_STRING, (err, user) => {
        if (err){
            console.error(err);
            return res.sendStatus(403).json({error: 'Failed to authenticate token'});
        }

        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
}

module.exports = { authenticateToken }