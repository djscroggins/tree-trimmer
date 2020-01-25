const express = require("express");
const path = require("path");
const http = require("http");

const app = express();

app.use(express.static(path.join(__dirname, "../dist/")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const port = process.env.EXPRESS_PORT || 3000;

const host = process.env.EXPRESS_HOST || "0.0.0.0";

const server = http.createServer(app);

server.listen(port, host, () => console.log("API running"));
