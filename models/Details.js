const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailsSchema = new Schema({
    locationName: String,
    date: { type: Date, required: true },
    lat: Number,
    lng: Number,
    plansID: {
        type: Schema.Types.ObjectId,
        ref: 'Plans',
        required: true,
    },
});

const Details = mongoose.model('Details', DetailsSchema);

module.exports = Details;