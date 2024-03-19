
const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    status: {
        type: String,
        required: false,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
});

const Target = mongoose.model('targets', TargetSchema);

module.exports = Target;