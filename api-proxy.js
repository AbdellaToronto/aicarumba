const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
// Configuration
const REPLICATE_TOKEN = "28ec9f5f7260a9f6a28eab2667db20f24f7e4286"; //process.env.REPLICATE_API_TOKEN;
const appendAuthHeaders = (proxyReq) => {
  proxyReq.setHeader("Authorization", `Token ${REPLICATE_TOKEN}`);
};
const onProxyRes = (proxyRes) => {
  proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  proxyRes.headers["Access-Control-Allow-Headers"] = "*";
  delete proxyRes.headers["content-type"];
};
const app = express();
app.use(
  "/api/",
  createProxyMiddleware({
    router: (req) => req.originalUrl.replace(/.*https?:\/\//, "https://"),
    changeOrigin: true,
    pathRewrite: { ".*": "" },
    onProxyReq: appendAuthHeaders,
    onProxyRes: onProxyRes,
  })
);
app.listen(8000, () => {
  console.log("Proxy Started");
  if (process.send) {
    process.send("ready");
  }
});
