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

  const webhookUrl = process.env.WEBHOOK_URL;

  try {
    const signature = req.headers["signature"];
    const clientId = req.headers["slient-Id"];
    const requestId = req.headers["request-id"];
    const requestTimestamp = req.headers["request-timestamp"];

    console.log("signature:", signature);
    console.log("client-id:", clientId);
    console.log("request-id:", requestId);
    console.log("request-timestamp:", requestTimestamp);
    if (!signature || !clientId || !requestId || !requestTimestamp) {
      return res.status(400).send({ error: "Missing required headers" });
    }

    const forwardRes = await axios.post(webhookUrl, req.body, {
      headers: {
        // ...req.headers,
        signature: signature,
        "client-id": clientId,
        "request-id": requestId,
        "request-timestamp": requestTimestamp,
        "Content-Type": "application/json",
      },
    });

    console.log("Response from webhook (" + webhookUrl + "):", forwardRes.data);
    res.status(forwardRes.status).send(forwardRes.data);
  } catch (error) {
    console.error(
      "Error forwarding request (" + webhookUrl + "):",
      error.message
    );

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
