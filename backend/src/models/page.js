const mongoose = require("mongoose");

const { Schema } = mongoose;

const imageSchema = new Schema({
  url: String,
  caption: String,
  // Add any other image properties you need
});

const musicSchema = new Schema({
  preset: String,
  name: String,
  emoji: String,
});

const pageSchema = new Schema(
  {
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
    mainMessage: {
      type: String,
      required: true,
    },
    subMessage: {
      type: String,
      required: false,
    },
    images: [imageSchema],
    music: musicSchema,
    animationStyle: {
      type: String,
      required: false,
    },
    backgroundColor: {
      type: String,
      required: false,
      default: "#ffffff",
    },
    backgroundImage: {
      type: String,
      required: false,
      default: null,
    },
    fontFamily: {
      type: String,
      required: false,
    },
    textColor: {
      type: String,
      required: false,
    },
    textSize: {
      type: String,
      required: false,
    },
    click_count: {
      type: Number, // Changed from String to Number
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Page = mongoose.models.Page || mongoose.model("Page", pageSchema);
module.exports = Page;
