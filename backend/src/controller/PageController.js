const Page = require("../models/page");
const { v4: uuidv4 } = require("uuid");
const slugify = require("../utils/slug");
const upload = require("../utils/multer");
const fs = require("fs");
const path = require("path");

class PageController {
  // Middleware for handling file uploads
  static uploadFiles() {
    return upload.fields([
      { name: "images", maxCount: 10 },
      { name: "backgroundImage", maxCount: 1 },
    ]);
  }

  async createPage(req, res) {
    try {
      const {
        title,
        tone,
        mainMessage,
        subMessage,
        animationStyle,
        backgroundColor,
        fontFamily,
        textColor,
        textSize,
        music,
      } = req.body;
  
      // Get user_uuid from authenticated user
      const user_uuid = req.user.uuid;
  
      // Generate a unique slug from title by adding a timestamp
      // This ensures uniqueness even if the same user creates pages with identical titles
      const baseSlug = slugify(title);
      const timestamp = new Date().getTime().toString().slice(-6); // Use last 6 digits of timestamp
      const slug = `${baseSlug}-${timestamp}`;
  
      // Handle file paths for images (completely optional)
      const images = req.files["images"]
        ? req.files["images"].map((file) => ({
            url: file.path,
            caption: "", // Default empty caption
          }))
        : []; // Empty array if no images
  
      // Handle background image (optional)
      const backgroundImage = req.files["backgroundImage"]
        ? req.files["backgroundImage"][0].path
        : null;
  
      const newPage = new Page({
        title,
        user_uuid,
        slug,
        tone,
        mainMessage,
        subMessage,
        images, // Will be empty array if no images
        music: music ? JSON.parse(music) : null,
        animationStyle,
        backgroundColor,
        backgroundImage, // Will be null if not provided
        fontFamily,
        textColor,
        textSize,
        click_count: 0,
      });
  
      const savedPage = await newPage.save();
  
      // Return response without internal fields
      const pageResponse = {
        id: savedPage._id,
        title: savedPage.title,
        slug: savedPage.slug,
        tone: savedPage.tone,
        mainMessage: savedPage.mainMessage,
        subMessage: savedPage.subMessage,
        images: savedPage.images,
        music: savedPage.music,
        animationStyle: savedPage.animationStyle,
        backgroundColor: savedPage.backgroundColor,
        backgroundImage: savedPage.backgroundImage,
        fontFamily: savedPage.fontFamily,
        textColor: savedPage.textColor,
        textSize: savedPage.textSize,
        click_count: savedPage.click_count,
        createdAt: savedPage.createdAt,
      };
  
      res.status(201).json({
        message: "Page created successfully",
        page: pageResponse,
      });
    } catch (error) {
      console.error("Page creation error:", error);
      
      // Clean up uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        });
      }
  
      // Provide more detailed error message for debugging
      if (error.code === 11000) {
        // This should no longer happen with our timestamp approach, but kept for safety
        return res.status(400).json({
          error: "Page creation failed due to a duplicate key error. Please try again.",
          details: error.message
        });
      }
      
      res.status(500).json({ 
        error: "Failed to create page", 
        details: error.message 
      });
    }
  }

  async updatePage(req, res) {
    try {
      const user_uuid = req.user.uuid;
      const { title, music, ...otherUpdates } = req.body;

      // Find the existing page first
      const existingPage = await Page.findOne({
        _id: req.params.id,
        user_uuid,
      });
      if (!existingPage) {
        return res
          .status(404)
          .json({ error: "Page not found or not owned by user" });
      }

      let updates = { ...otherUpdates };

      // If title is being updated, generate new slug
      if (title) {
        updates.title = title;
        updates.slug = slugify(title);
      }

      // Parse music if provided
      if (music) {
        updates.music = JSON.parse(music);
      }

      // Handle file uploads
      if (req.files) {
        // Handle images update
        if (req.files["images"]) {
          // Delete old images
          existingPage.images.forEach((image) => {
            if (fs.existsSync(image.url)) {
              fs.unlinkSync(image.url);
            }
          });
          // Add new images
          updates.images = req.files["images"].map((file) => ({
            url: file.path,
            caption: "", // Default empty caption
          }));
        }

        // Handle background image update
        if (req.files["backgroundImage"]) {
          // Delete old background image if exists
          if (
            existingPage.backgroundImage &&
            fs.existsSync(existingPage.backgroundImage)
          ) {
            fs.unlinkSync(existingPage.backgroundImage);
          }
          updates.backgroundImage = req.files["backgroundImage"][0].path;
        }
      }

      const updatedPage = await Page.findOneAndUpdate(
        { _id: req.params.id, user_uuid },
        updates,
        { new: true, runValidators: true }
      ).select("-__v -updatedAt");

      res.status(200).json({
        message: "Page updated successfully",
        page: updatedPage,
      });
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        });
      }

      if (error.code === 11000) {
        return res
          .status(400)
          .json({ error: "Page with this title already exists" });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deletePage(req, res) {
    try {
      const user_uuid = req.user.uuid;
      const page = await Page.findOne({ _id: req.params.id, user_uuid });

      if (!page) {
        return res
          .status(404)
          .json({ error: "Page not found or not owned by user" });
      }

      // Delete associated images
      if (page.images) {
        page.images.forEach((image) => {
          if (fs.existsSync(image.url)) {
            fs.unlinkSync(image.url);
          }
        });
      }

      // Delete background image
      if (page.backgroundImage && fs.existsSync(page.backgroundImage)) {
        fs.unlinkSync(page.backgroundImage);
      }

      // Delete the page from database
      await Page.findOneAndDelete({ _id: req.params.id, user_uuid });

      res.status(200).json({
        message: "Page deleted successfully",
        pageId: req.params.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserPages(req, res) {
    try {
      const user_uuid = req.user.uuid;
      const pages = await Page.find({ user_uuid }).select("-__v -updatedAt");

      res.status(200).json({
        message: "Pages retrieved successfully",
        pages,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPageById(req, res) {
    try {
      const user_uuid = req.user.uuid;
      const page = await Page.findOne({ _id: req.params.id, user_uuid }).select(
        "-__v -updatedAt"
      );

      if (!page) {
        return res
          .status(404)
          .json({ error: "Page not found or not owned by user" });
      }

      res.status(200).json({
        message: "Page retrieved successfully",
        page,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPageBySlug(req, res) {
    try {
      const page = await Page.findOne({ slug: req.params.slug }).select(
        "-__v -updatedAt"
      );

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      // Increment click count
      page.click_count += 1;
      await page.save();

      res.status(200).json({
        message: "Page retrieved successfully",
        page,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addVoteToPage(req, res) {
    try {
      const user_uuid = req.user.uuid;
      const { pageId } = req.params;
  
      const page = await Page.findById(pageId);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
  
      // Add user_uuid to votes (allowing duplicates)
      page.votes.push(user_uuid);
      await page.save();
  
      res.status(200).json({
        message: "Vote added successfully",
        votes: page.votes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async removeVoteFromPage(req, res) {
    try {
      const user_uuid = req.user.uuid;
      const { pageId } = req.params;
  
      const page = await Page.findById(pageId);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
  
      // Find index of one occurrence of user_uuid in the votes array
      const index = page.votes.indexOf(user_uuid);
      if (index === -1) {
        return res.status(400).json({ message: "User has not voted on this page" });
      }
  
      // Remove one occurrence of the user's vote
      page.votes.splice(index, 1);
      await page.save();
  
      res.status(200).json({
        message: "Vote removed successfully",
        votes: page.votes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}

module.exports = PageController;
