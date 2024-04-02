
const mongoose = require('../common-modules/mongoDBConnection');

const ShotSchema = new mongoose.Schema({
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    shooterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

const Shot = mongoose.model('shots', ShotSchema);

module.exports = Shot;