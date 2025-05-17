const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            
            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            
            // Generate a unique UUID
            const uuid = uuidv4();
            
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create new user with all required fields
            const user = new User({ 
                uuid, 
                name, 
                email, 
                password: hashedPassword,
                role: "user"
            });
            
            await user.save();
            
            const userResponse = {
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            };
            
            res.status(201).json({ 
                message: "User created successfully", 
                user: userResponse 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController;