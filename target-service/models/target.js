const mongoose = require('../common-modules/mongoDBConnection');

const TargetSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    imageUrl: {
        type: String,
        required: true
    },
    locationDescription: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: false,
        enum: ['Pending', 'Completed', 'Pending_deletion', 'Expired'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

TargetSchema.index({ location: '2dsphere' });

const Target = mongoose.model('targets', TargetSchema);

module.exports = Target;