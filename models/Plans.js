const User = require('./../models/User');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlansSchema = new Schema({
    tripName: String,
    description: String,
    // category: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isPublic: Boolean,
    tripMembers: Number,
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Plans = mongoose.model('Plans', PlansSchema);

module.exports = Plans;
