const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
    locationName: String,
    lat: Number,
    lng: Number,
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist;