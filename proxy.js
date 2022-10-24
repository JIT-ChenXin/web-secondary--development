module.exports = {
  "/api": {
    target: "http://10.15.112.12:48080/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
