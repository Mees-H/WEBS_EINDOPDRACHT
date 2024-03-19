const mongoose = require('mongoose');
const mongoDBurl = process.env.MONGODB_URL || 'mongodb://mongodb:27017/targets';

mongoose.connect(mongoDBurl)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

console.log('Connected to MongoDB');

module.exports = mongoose;