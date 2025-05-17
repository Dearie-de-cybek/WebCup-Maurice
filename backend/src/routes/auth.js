const express = require("express");
const AuthController = require("../controller/AuthController");
const { isAuthenticated } = require("../middlewares/auth");
const useCatchErrors = require("../error/catchErrors");

class AuthRoute {
  router = express.Router();
  authController = new AuthController();

  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Public authentication routes
    this.router.post(
      `${this.path}/register`,
      useCatchErrors(this.authController.register)
    );

    this.router.post(
      `${this.path}/login`,
      useCatchErrors(this.authController.login)
    );
  }
}

module.exports = AuthRoute;
