const mongoose = require('mongoose');

const MindmapSchema = new mongoose.Schema({
    map_name: {
        type: String
    },
    html: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Mindmap = mongoose.model('Mindmap', MindmapSchema);

module.exports = Mindmap;