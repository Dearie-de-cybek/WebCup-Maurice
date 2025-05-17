const mongoose = require('mongoose');

const { Schema } = mongoose;

const pageSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    user_uuid: {
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
    sub_message: {
        type: String,
        required: false,
    },
    pictures: {
        type: String,
        required: false,
    },
    music: {
        type: String,
        required: false,
    },
    video: {
        type: String,
        required: false,
    },
    background_color: {
        type: String,
        required: false,
    },
    text_color: {
        type: String,
        required: false,
    },
    click_count: {
        type: String,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Page', pageSchema);