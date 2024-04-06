const mongoose = require('mongoose');
const mongoDBurl = process.env.MONGODB_URL || 'mongodb://mongodb:27017/scores';

function connectWithRetry() {
    return mongoose.connect(mongoDBurl)
        .then(() => {
            console.log('1. Connected to MongoDB at ', mongoDBurl);
        })
        .catch(err => {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        });
}


connectWithRetry();

console.log('2. Connected to MongoDB at ', mongoDBurl);

module.exports = mongoose;