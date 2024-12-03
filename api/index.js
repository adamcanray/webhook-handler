const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// POST endpoint
app.post("/hooks/log", (req, res) => {
  console.log("Headers:", req.headers); // Log all headers
  console.log("Body:", req.body); // Log the request body

  res.send("Headers and body logged to the console.");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
