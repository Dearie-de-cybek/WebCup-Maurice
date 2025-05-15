const mongoose = require('mongoose');
require('dotenv').config();

// Connection URI
const uri = process.env.MONGO_URI;

async function connectWithMongoose() {
  try {
    await mongoose.connect(uri, {
      // These options are no longer needed in newer versions but included for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB with Mongoose successfully');
  } catch (error) {
    console.error('Mongoose connection error:', error);
    throw error;
  }
}

connectWithMongoose().catch(console.error);

// Define a schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

// Create a model
const User = mongoose.model('User', userSchema);