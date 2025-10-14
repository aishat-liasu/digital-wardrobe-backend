const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Welcome to my homepage</h1>");
});

app.all("*", (req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
