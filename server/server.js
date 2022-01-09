const path = require("path");
const express = require("express");
const {
  createUser,
  updateSettings,
  getFeed,
  signInUser,
  getUser,
  getMessages,
  getConversation,
  getConversations,
  sendMessage,
  updateBio,
} = require("./handlers");

const PORT = 8000;

express()
  .use(express.json())

  .post("/api/new-user", createUser)
  .post("/api/user", signInUser)
  .post("/api/message", sendMessage)
  .put("/api/user", updateSettings)
  .put("/api/user/bio", updateBio)
  .get("/api/feed/:id", getFeed)
  .get("/api/messages/:id", getMessages)
  .get("/api/conversations/:id", getConversations)
  .get("/api/conversation/:id", getConversation)
  .get("/api/user/:id", getUser)

  .listen(PORT, function () {
    console.info("🌍 Listening on port " + PORT);
  });
