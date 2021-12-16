const path = require("path");
const express = require("express");
const {
  createUser,
  updateSettings,
  getFeed,
  getCurrentUser,
  getUser,
  getMessages,
  sendMessage,
  updateBio,
} = require("./handlers");

const PORT = 8000;

express()
  .use(express.json())

  .post("/api/user", createUser)
  .post("/api/message", sendMessage)
  .put("/api/user", updateSettings)
  .put("/api/user/bio", updateBio)
  .get("/api/feed/:id", getFeed)
  .get("/api/user", getCurrentUser)
  .get("/api/messages/:id", getMessages)
  .get("/api/user/:id", getUser)

  .listen(PORT, function () {
    console.info("🌍 Listening on port " + PORT);
  });
