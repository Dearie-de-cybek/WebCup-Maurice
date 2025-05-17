const express = require("express");
const PageController = require("../controller/PageController");
const isAuthenticated = require("../middlewares/auth");
const useCatchErrors = require("../error/catchErrors");
const upload = require("../utils/multer"); // Import Multer configuration

class PageRoute {
  router = express.Router();
  pageController = new PageController();

  path = "/pages";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Multer middleware configuration
    const uploadFiles = upload.fields([
      { name: 'pictures', maxCount: 10 },
      { name: 'music', maxCount: 1 },
      { name: 'video', maxCount: 1 }
    ]);

    // Create a new page (authenticated)
    this.router.post(
      `${this.path}/store`,
      isAuthenticated,
      uploadFiles,
      useCatchErrors(this.pageController.createPage.bind(this.pageController))
    );

    // Get all pages for authenticated user
    this.router.get(
      `${this.path}/all`,
      isAuthenticated,
      useCatchErrors(this.pageController.getUserPages.bind(this.pageController))
    );

    // Get specific page by ID (authenticated, user must own page)
    this.router.get(
      `${this.path}/show/:id`,
      isAuthenticated,
      useCatchErrors(this.pageController.getPageById.bind(this.pageController))
    );

    // Update a page (authenticated, user must own page)
    this.router.patch(
      `${this.path}/update/:id`,
      isAuthenticated,
      uploadFiles,
      useCatchErrors(this.pageController.updatePage.bind(this.pageController))
    );

    // Delete a page (authenticated, user must own page)
    this.router.delete(
      `${this.path}/delete/:id`,
      isAuthenticated,
      useCatchErrors(this.pageController.deletePage.bind(this.pageController))
    );

    // Public route to get page by slug (no authentication required)
    this.router.get(
      `${this.path}/public/:slug`,
      useCatchErrors(this.pageController.getPageBySlug.bind(this.pageController))
    );
  }
}

module.exports = PageRoute;