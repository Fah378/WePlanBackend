const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserData = new Schema({
    name: String,
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;