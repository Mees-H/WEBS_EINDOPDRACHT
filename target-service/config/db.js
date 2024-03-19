const mongoose = require('mongoose');
const mongoDBurl = process.env.MONGODB_URL || 'mongodb://mongodb:27017/targets';

function connectWithRetry() {
    return mongoose.connect(mongoDBurl, { useNewUrlParser: true })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        });
}


connectWithRetry();

console.log('Connected to MongoDB');

module.exports = mongoose;