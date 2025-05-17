const Page = require("../models/page");
const { v4: uuidv4 } = require("uuid");
const slugify = require("../utils/slug");
const upload = require("../utils/multerConfig");
const fs = require("fs");
const path = require("path");

class PageController {
  // Middleware for handling file uploads
  static uploadFiles() {
    return upload.fields([
      { name: "pictures", maxCount: 10 },
      { name: "music", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]);
  }

  async createPage(req, res) {
    try {
      const {
        title,
        tone,
        message,
        sub_message,
        background_color,
        text_color,
      } = req.body;

      // Get user_uuid from authenticated user
      const user_uuid = req.user.uuid;

      // Generate slug from title
      const slug = slugify(title);

      // Handle file paths
      const pictures = req.files["pictures"]
        ? req.files["pictures"].map((file) => file.path)
        : [];
      const music = req.files["music"] ? req.files["music"][0].path : null;
      const video = req.files["video"] ? req.files["video"][0].path : null;

      const newPage = new Page({
        title,
        user_uuid,
        slug,
        tone,
        message,
        sub_message,
        pictures,
        music,
        video,
        background_color,
        text_color,
        click_count: 0,
      });

      const savedPage = await newPage.save();

      // Return response without internal fields
      const pageResponse = {
        id: savedPage._id,
        title: savedPage.title,
        slug: savedPage.slug,
        tone: savedPage.tone,
        message: savedPage.message,
        sub_message: savedPage.sub_message,
        pictures: savedPage.pictures,
        music: savedPage.music,
        video: savedPage.video,
        click_count: savedPage.click_count,
        createdAt: savedPage.createdAt,
      };

      res.status(201).json({
        message: "Page created successfully",
        page: pageResponse,
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
        return res.status(400).json({
          error: "Page with this title or for this user already exists",
        });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updatePage(req, res) {
    try {
      const user_uuid = req.user.uuid;
      const { title, ...otherUpdates } = req.body;

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

      // Handle file uploads
      if (req.files) {
        // Delete old files if new ones are uploaded
        if (req.files["pictures"]) {
          existingPage.pictures.forEach((picture) => {
            if (fs.existsSync(picture)) {
              fs.unlinkSync(picture);
            }
          });
          updates.pictures = req.files["pictures"].map((file) => file.path);
        }

        if (req.files["music"] && existingPage.music) {
          if (fs.existsSync(existingPage.music)) {
            fs.unlinkSync(existingPage.music);
          }
          updates.music = req.files["music"][0].path;
        }

        if (req.files["video"] && existingPage.video) {
          if (fs.existsSync(existingPage.video)) {
            fs.unlinkSync(existingPage.video);
          }
          updates.video = req.files["video"][0].path;
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

      // Delete associated files
      if (page.pictures) {
        page.pictures.forEach((picture) => {
          if (fs.existsSync(picture)) {
            fs.unlinkSync(picture);
          }
        });
      }

      if (page.music && fs.existsSync(page.music)) {
        fs.unlinkSync(page.music);
      }

      if (page.video && fs.existsSync(page.video)) {
        fs.unlinkSync(page.video);
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
}

module.exports = PageController;
