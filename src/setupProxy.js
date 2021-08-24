const { createProxyMiddleware } = require("http-proxy-middleware");

const API_SERVICE_URL = "https://maps.googleapis.com";

module.exports = function(app) {
  app.use(
    "/googleapi",
    createProxyMiddleware({
      target: API_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        [`^/googleapi`]: "",
      },
    })
  );
};
