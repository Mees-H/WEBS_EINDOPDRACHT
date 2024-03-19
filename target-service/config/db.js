const mongoose = require('mongoose');
const mongoDBurl = process.env.MONGODB_URL || 'mongodb://localhost:27017/target';

mongoose.connect(mongoDBurl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

module.exports = mongoose;