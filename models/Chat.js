const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    message: {
        type: String
    },
    username: {
        type: String
    }
});

module.exports = Chat = mongoose.model('chat', ChatSchema);