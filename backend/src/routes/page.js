const express = require("express");
const PageController = require("../controller/PageController");
const isAuthenticated  = require("../middlewares/auth");
const useCatchErrors = require("../error/catchErrors");

class PageRoute {
  router = express.Router();
  pageController = new PageController();

  path = "/pages";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create a new page (authenticated)
    this.router.post(
      `${this.path}/store`,
      isAuthenticated,
      useCatchErrors(this.pageController.createPage)
    );

    // Get all pages for authenticated user
    this.router.get(
      `${this.path}/all`,
      isAuthenticated,
      useCatchErrors(this.pageController.getUserPages)
    );

    // Get specific page by ID (authenticated, user must own page)
    this.router.get(
      `${this.path}/show/:id`,
      isAuthenticated,
      useCatchErrors(this.pageController.getPageById)
    );

    // Update a page (authenticated, user must own page)
    this.router.patch(
      `${this.path}/update/:id`,
      isAuthenticated,
      useCatchErrors(this.pageController.updatePage)
    );

    // Delete a page (authenticated, user must own page)
    this.router.delete(
      `${this.path}/delete/:id`,
      isAuthenticated,
      useCatchErrors(this.pageController.deletePage)
    );

    // Public route to get page by slug (no authentication required)
    this.router.get(
      `${this.path}/public/:slug`,
      useCatchErrors(this.pageController.getPageBySlug)
    );
  }
}

module.exports = PageRoute;
