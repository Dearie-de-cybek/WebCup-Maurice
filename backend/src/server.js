
const http = require("http");
const App = require("./app");
const AuthRoute = require("./routes/auth");
const logger = require("./config/logger");

// Initialize Express app
const app = new App();

// Initialize routes
app.initializedRoutes([
  new AuthRoute(),
]);

// Create HTTP server
const server = http.createServer(app.app);

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`Server started at http://localhost:${PORT}`);
});
