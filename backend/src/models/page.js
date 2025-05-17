const mongoose = require('mongoose');

const { Schema } = mongoose;

const pageSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    tone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    media: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Page', pageSchema);