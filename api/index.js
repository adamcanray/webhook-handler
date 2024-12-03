const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/proxy/webhook", async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  try {
    const webhookUrl = process.env.WEBHOOK_URL;

    const forwardRes = await axios.post(webhookUrl, req.body, {
      headers: {
        ...req.headers,
        "Content-Type": "application/json",
      },
    });

    console.log("Response from webhook:", forwardRes.data);
    res.status(forwardRes.status).send(forwardRes.data);
  } catch (error) {
    console.error("Error forwarding request:", error.message);

    if (error.response) {
      res
        .status(error.response.status)
        .send(error.response.data || { error: "Error from target server" });
    } else {
      res.status(500).send({ error: "Failed to forward request" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
