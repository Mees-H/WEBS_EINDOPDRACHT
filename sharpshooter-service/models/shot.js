
const mongoose = require('../common-modules/mongoDBConnection');

const ShotSchema = new mongoose.Schema({
    // This gets added from the JWT token
    shooterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    targetId: {
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
        enum: ['Pending', 'Completed', 'Pending_deletion', 'Expired'],
        default: 'Pending'
    },
    score: {
        type: Number,
        required: false,
        default: null
    }
}, {
    timestamps: true
});

const Shot = mongoose.model('shots', ShotSchema);

module.exports = Shot;