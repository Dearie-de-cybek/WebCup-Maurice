const Page = require("../models/page");
const { v4: uuidv4 } = require("uuid");
const slugify = require("../utils/slugGenerator");

class PageController {
  async createPage(req, res) {
    try {
      const {
        title,
        tone,
        message,
        sub_message,
        pictures,
        music,
        video,
        background_color,
        text_color,
      } = req.body;

      // Get user_uuid from authenticated user
      const user_uuid = req.user.uuid;

      // Generate slug from title
      const slug = slugify(title);

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
        click_count: savedPage.click_count,
        createdAt: savedPage.createdAt,
      };

      res.status(201).json({
        message: "Page created successfully",
        page: pageResponse,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({
            error: "Page with this title or for this user already exists",
          });
      }
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

  async updatePage(req, res) {
    try {
      const user_uuid = req.user.uuid;
      const { title, ...otherUpdates } = req.body;

      let updates = { ...otherUpdates };

      // If title is being updated, generate new slug
      if (title) {
        updates.title = title;
        updates.slug = slugify(title);
      }

      const updatedPage = await Page.findOneAndUpdate(
        { _id: req.params.id, user_uuid },
        updates,
        { new: true, runValidators: true }
      ).select("-__v -updatedAt");

      if (!updatedPage) {
        return res
          .status(404)
          .json({ error: "Page not found or not owned by user" });
      }

      res.status(200).json({
        message: "Page updated successfully",
        page: updatedPage,
      });
    } catch (error) {
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
      const deletedPage = await Page.findOneAndDelete({
        _id: req.params.id,
        user_uuid,
      });

      if (!deletedPage) {
        return res
          .status(404)
          .json({ error: "Page not found or not owned by user" });
      }

      res.status(200).json({
        message: "Page deleted successfully",
        pageId: req.params.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PageController;
