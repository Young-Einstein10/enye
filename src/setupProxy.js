const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/place/nearbysearch/json",
    createProxyMiddleware({
      target: "https://maps.googleapis.com/maps/api",
      changeOrigin: true,
    })
  );
};
