// const dotenv = require("dotenv");
// dotenv.config({ path: "./.env" });

// const LOCAL_POSTGRESQL = "postgresql://postgres:@localhost:5432/db_name";

// const ENV = {
//   // Environment
//   nodeEnv: process.env.NODE_ENV || 'development',
  
//   // Server config
//   port: process.env.PORT || 8080,
  
//   // Database connection
//   databaseUrl:
//     process.env.NODE_ENV === "development"
//       ? LOCAL_POSTGRESQL
//       : process.env.DATABASE_URL,
  
//   // Authentication config
//   jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
//   jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
//   // URLs
//   backendURL:
//     process.env.NODE_ENV === "development"
//       ? "http://localhost:8080"
//       : `https://`, 
  
//   clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
// };

// module.exports = ENV;

const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb+srv://oduahmichaelebuka:3nr4LQOB0IxYDv3o@cluster1.3ezhf2e.mongodb.net/';

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